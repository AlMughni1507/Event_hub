// Utility untuk standardize API responses
class ApiResponse {
  static success(res, data = null, message = 'Success') {
    return res.status(200).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    });
  }

  static created(res, data = null, message = 'Created successfully') {
    return res.status(201).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    });
  }

  static paginated(res, data, page, limit, total, message = 'Data retrieved successfully') {
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return res.status(200).json({
      success: true,
      message,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage,
        hasPrevPage
      },
      timestamp: new Date().toISOString()
    });
  }

  static badRequest(res, message = 'Bad request') {
    return res.status(400).json({
      success: false,
      message,
      timestamp: new Date().toISOString()
    });
  }

  static unauthorized(res, message = 'Unauthorized') {
    return res.status(401).json({
      success: false,
      message,
      timestamp: new Date().toISOString()
    });
  }

  static forbidden(res, message = 'Forbidden') {
    return res.status(403).json({
      success: false,
      message,
      timestamp: new Date().toISOString()
    });
  }

  static notFound(res, message = 'Not found') {
    return res.status(404).json({
      success: false,
      message,
      timestamp: new Date().toISOString()
    });
  }

  static conflict(res, message = 'Conflict') {
    return res.status(409).json({
      success: false,
      message,
      timestamp: new Date().toISOString()
    });
  }

  static error(res, message = 'Internal server error', status = 500) {
    return res.status(status).json({
      success: false,
      message,
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = ApiResponse;
