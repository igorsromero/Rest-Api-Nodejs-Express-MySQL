const conexao = require("./conexao");

const executaQuery = (query, parametros = "") => {
    return new Promise((resolve, reject) => {
        conexao.query(query, parametros, (error, result, fields) => {
            if(error) {
                reject(error);
            } else {
                resolve(result);
            }
    });
    });
};

module.exports = executaQuery;