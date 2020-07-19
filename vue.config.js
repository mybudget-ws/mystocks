// https://cli.vuejs.org/guide/deployment.html#github-pages
// module.exports = {
//   publicPath: process.env.NODE_ENV === 'production' ?
//     '/mystocks/' :
//     '/'
// };
module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ?
    '/' :
    '/'
};
