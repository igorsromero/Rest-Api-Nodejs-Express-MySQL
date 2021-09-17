const conexao = require("../infraestrutura/conexao");
const uploadDeArquivo = require("../arquivos/uploadDeArquivos");

class Pet {
    adiciona(pet, response) {
        const query = "INSERT INTO Pets SET ?";

        uploadDeArquivo(pet.imagem, pet.nome, (erro, novoCaminho) => {

            if(erro) {
                response.status(400).json({erro});
            } else {

                const novoPet = {nome: pet.nome, imagem: novoCaminho};

                conexao.query(query, novoPet, (error, result) => {
                    if(error) {
                        response.status(400).json(error);
                    } else {
                        response.status(200).json(novoPet);
                    }
                });
            
            }
        });
    }
}

module.exports = new Pet();