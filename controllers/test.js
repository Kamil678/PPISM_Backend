exports.getTest = (req, res, next) => {
    res.status(200).json({
        test: 'Test ok'
    });
};