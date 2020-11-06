// ------------------------------------------------------------------
// APP CONFIGURATION
// ------------------------------------------------------------------

module.exports = {
  logging: true,

  intentMap: {
    'Default Welcome Intent': 'LAUNCH',
    'Default Fallback Intent': 'Unhandled',
  },

  db: {
    FileDb: {
      pathToFile: '../db/db.json',
    },
  },
};
