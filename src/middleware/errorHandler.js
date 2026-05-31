const errorHandler = (err, req, res, next) => {
    console.error("❌ Error:", err.message);
    res
      .status(500)
      .json({
        error: "Internal Server Error",
        ...(process.env.NODE_ENV !== "production" && { details: err.message }),
      });
}

export default errorHandler;