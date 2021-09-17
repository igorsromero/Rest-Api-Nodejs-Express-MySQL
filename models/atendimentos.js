const { default: axios } = require("axios");
const moment = require("moment");
const conexao = require('../infraestrutura/conexao');

class Atendimento {
    adiciona(atendimento, response) {
        const dataCriacao = moment().format('YYYY-MM-DD HH:mm:ss')
        const data = moment(atendimento.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss')
        
        const dataEhValida = moment(data).isSameOrAfter(dataCriacao);
        const clienteEhValido = atendimento.cliente.length >= 5

        const validacoes = [
            {
                nome: "data",
                valido: dataEhValida,
                mensagem: "Data deve ser maior ou igual a data atual"
            },
            {
                nome: "cliente",
                valido: clienteEhValido,
                mensagem: "Cliente deve ter pelo menos cinco caracteres"
            }
        ]

        const erros = validacoes.filter(campo => !campo.valido);
        const existemErros = erros.length;

        if(existemErros){
            response.status(400).json(erros)
        } else {
            const atendimentoDatado = {...atendimento, dataCriacao, data};
        
            const sql = "INSERT INTO Atendimentos SET ?"
    
            conexao.query(sql, atendimentoDatado, (error, result) => {
                if(error) {
                    response.status(400).json(error);
                } else { 
                    response.status(201).json(atendimentoDatado);
                }
            })
        }
    }

    lista(response) {
        const sql = "SELECT * FROM Atendimentos"

        conexao.query(sql, (error, result) => {
            if (error) {
                response.status(400).json(error)
            } else {
                response.status(200).json(result)
            }
        })
    }

    buscaPorId(id, response) {
        const sql = `SELECT * FROM Atendimentos WHERE id=${id}`

        conexao.query(sql, async (error, result) => {
            
            const atendimento = result[0];
            
            const cpf = atendimento.cliente;

            if(error) {
                response.status(400).json(error);
            } else { 
                const { data } = await axios.get(`http://localhost:8082/${cpf}`);
                
                atendimento.cliente = data;

                response.status(200).json(atendimento);
            }
        })
    }

    altera(id, valores, response) {
        if(valores.data) {
            valores.data = moment(valores.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss');
        }
        const sql = "UPDATE Atendimentos SET ? WHERE id=?";

        conexao.query(sql, [valores, id], (error, result) => {
            if(error){
                response.status(400).json(error);
            } else {
                response.status(200).json({...valores, id});
            }
        })
    }

    deleta(id, response) {
        const sql = "DELETE FROM Atendimentos WHERE id=?";

        conexao.query(sql, id, (error, result) => {
            if(error) {
                response.status(400).json(error);
            } else {
                response.status(200).json({id});
            }
        })
    }
}

module.exports = new Atendimento;