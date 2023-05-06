module.exports = {
  apps: [
    {
      name: "JCWD-0106-03", // Format JCWD-{batchcode}-{groupnumber}
      script: "./projects/server/src/index.js",
      env: {
        NODE_ENV: "production",
        PORT: 8603,
      },
      time: true,
    },
  ],
};
