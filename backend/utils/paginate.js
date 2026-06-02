const paginate = async (model, query = {}, options = {}) => {
  const page = parseInt(options.page, 10) || 1;
  const limit = Math.min(parseInt(options.limit, 10) || 10, 100); 
  const skip = (page - 1) * limit;

  let sort = {};
  if (options.sortBy) {
    const parts = options.sortBy.split(':');
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
  } else {
    sort = { date: -1 }; 
  }

  const projection = options.projection || {};

  const [total, results] = await Promise.all([
    model.countDocuments(query),
    model.find(query, projection)
      .sort(sort)
      .skip(skip)
      .limit(limit)
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    results,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};

module.exports = paginate;
