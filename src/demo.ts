
const { pg } = require("./db");

/**
 * Builds and executes a pagination query.
 * @param {Object} params - The parameters for the query.
 * @param {string} params.baseQuery - The base SQL query.
 * @param {Object} [params.filters={}] - The filters to apply.
 * @param {Object} [params.sort={}] - The sorting options.
 * @param {number} [params.page=1] - The current page number.
 * @param {number} [params.pageSize=10] - The number of items per page.
 * @param {string} [params.search] - The search term.
 * @param {Array<string>} [params.searchColumns=[]] - The columns to search.
 * @returns {Promise<{data: Array, total: number}>} The query result.
 */
module.exports.paginationQueryBuilder = async ({
  baseQuery,
  filters = {},
  sort = {},
  page = 1,
  pageSize = 10,
  search,
  searchColumns = [],
}) => {
  let query = baseQuery;
  const values = [];
  const totalValues = [];

  // Adding filters
  const filterConditions = buildFilterConditions(filters, values);
  if (filterConditions.length > 0) {
    query +=
      (query.toLowerCase().includes("where") ? " AND " : " WHERE ") +
      filterConditions.join(" AND ");
  }

  // Add search conditions
  const searchCondition = buildSearchCondition(search, searchColumns, values);
  if (searchCondition) {
    query +=
      (query.toLowerCase().includes("where") ? " AND " : " WHERE ") +
      searchCondition;
  }

  // Adding sorting
  if (sort.column) {
    query += ` ORDER BY ${sort.column} ${sort.order.toUpperCase()}`;
  }

  // Construct the total count query
  const totalCountQuery = `SELECT COUNT(*) FROM (${query}) as subquery`;

  // Adding pagination
  const offset = (page - 1) * pageSize;
  values.push(pageSize, offset);
  query += ` LIMIT $${values.length - 1} OFFSET $${values.length}`;

  // Execute both queries concurrently
  const [dataRes, countRes] = await Promise.all([
    pg.query(query, values),
    pg.query(totalCountQuery, values),
  ]);

  return {
    data: dataRes.rows,
    total: parseInt(countRes.rows[0].count, 10),
  };
};

/**
 * Builds and executes an infinite scroll query.
 * @param {Object} params - The parameters for the query.
 * @param {string} params.baseQuery - The base SQL query.
 * @param {Object} [params.filters={}] - The filters to apply.
 * @param {Object} [params.sort={}] - The sorting options.
 * @param {string} [params.cursor] - The cursor for pagination.
 * @param {number} [params.limit=10] - The number of items to fetch.
 * @param {string} [params.search=""] - The search term.
 * @param {Array<string>} [params.searchColumns=[]] - The columns to search.
 * @returns {Promise<{data: Array, total: number, nextCursor: string|null}>} The query result.
 */
module.exports.infiniteScrollQueryBuilder = async ({
  baseQuery,
  filters = {},
  sort = {},
  cursor,
  limit = 10,
  search = "",
  searchColumns = [],
}) => {
  let query = baseQuery;
  const values = [];
  const totalValues = [];

  // Adding filters
  const filterConditions = buildFilterConditions(filters, values);
  if (filterConditions.length > 0) {
    query +=
      (query.toLowerCase().includes("where") ? " AND " : " WHERE ") +
      filterConditions.join(" AND ");
  }

  // Add search conditions
  const searchCondition = buildSearchCondition(search, searchColumns, values);
  if (searchCondition) {
    query +=
      (query.toLowerCase().includes("where") ? " AND " : " WHERE ") +
      searchCondition;
  }

  // Adding cursor-based pagination
  if (cursor) {
    values.push(cursor);
    query +=
      (query.toLowerCase().includes("where") ? " AND " : " WHERE ") +
      `id > $${values.length}`;
  }

  // Adding sorting
  if (sort.column) {
    query += ` ORDER BY ${sort.column} ${sort.order.toUpperCase()}`;
  }

  // Construct the total count query without cursor and limit
  const totalCountQuery = `SELECT COUNT(*) FROM (${baseQuery}) as subquery`;

  values.push(limit);
  query += ` LIMIT $${values.length}`;

  // Execute both queries concurrently
  const [dataRes, countRes] = await Promise.all([
    pg.query(query, values),
    pg.query(totalCountQuery, totalValues),
  ]);

  return {
    data: dataRes.rows,
    total: parseInt(countRes.rows[0].count, 10),
    nextCursor: dataRes.rows.length
      ? dataRes.rows[dataRes.rows.length - 1].id
      : null,
  };
};

/**
 * Builds and executes a query based on the specified type (pagination or infinite scroll).
 * @param {Object} params - The parameters for the query.
 * @param {string} params.baseQuery - The base SQL query.
 * @param {Object} [params.filters={}] - The filters to apply.
 * @param {Object} [params.sort={}] - The sorting options.
 * @param {string} [params.search] - The search term.
 * @param {Array<string>} [params.searchColumns=[]] - The columns to search.
 * @param {number} [params.page=1] - The current page number.
 * @param {number} [params.pageSize=10] - The number of items per page.
 * @param {string} [params.cursor] - The cursor for pagination.
 * @param {number} [params.limit=10] - The number of items to fetch.
 * @param {string} [params.type='pagination'] - The type of query ('pagination' or 'infiniteScroll').
 * @returns {Promise<Object>} The query result.
 */
module.exports.queryBuilder = async ({
  baseQuery,
  filters = {},
  sort = {},
  search,
  searchColumns = [],
  page = 1,
  pageSize = 10,
  cursor,
  limit = 10,
  type = "pagination", // 'pagination' or 'infiniteScroll'
}) => {
  const params = {
    baseQuery,
    filters,
    sort,
    search,
    searchColumns,
  };

  if (type === "infiniteScroll") {
    params.cursor = cursor;
    params.limit = limit;
    return this.infiniteScrollQueryBuilder(params);
  } else {
    params.page = page;
    params.pageSize = pageSize;
    return this.paginationQueryBuilder(params);
  }
};

module.exports.getData = async ({
  page,
  pageSize,
  sort,
  order,
  search,
  ...filters
}) => {
  const queryObject = {
    baseQuery: `SELECT id, CONCAT(first_name, ' ', last_name) as name,
                email, gender, company 
                FROM user_data ud `,
    filters: {
      "ud.gender": filters.gender,
      "ud.first_name": filters.first_name,
      "ud.last_name": filters.last_name,
      "ud.email": filters.email,
      "ud.company": filters.company,
    },
    sort: {
      column: sort || "ud.id",
      order: order || "asc",
    },
    page: parseInt(page, 10),
    pageSize: parseInt(pageSize, 10),
    search: search,
    searchColumns: ["ud.first_name", "ud.last_name", "ud.email", "ud.company"],
    type: "pagination", // 'pagination' or 'infiniteScroll'
  };

  const result = await this.queryBuilder(queryObject);
  return result;
};
