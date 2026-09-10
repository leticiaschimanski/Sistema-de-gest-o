wfdocument.addEventListener("DOMContentLoaded", function () {

    const formulario = document.querySelector("form");

    const nome = document.querySelector("#nome");
    const categoria = document.querySelector("#categoria");
    const quantidade = document.querySelector("#quantidade");
    const preco = document.querySelector("#preco");

    const cep = document.querySelector("#cep");
    const endereco = document.querySelector("#endereco");
    const bairro = document.querySelector("#bairro");
    const cidade = document.querySelector("#cidade");
    const estado = document.querySelector("#estado");


    // ==========================================
    // BUSCAR ENDEREÇO AUTOMATICAMENTE PELO CEP
    // ==========================================

    cep.addEventListener("blur", function () {

        // Remove tudo que não for número
        const cepNumeros = cep.value.replace(/\D/g, "");

        // Verifica se o CEP possui 8 números
        if (cepNumeros.length !== 8) {
            mostrarErro(cep, "Digite um CEP válido com 8 números.");
            return;
        }

        // Remove mensagem de erro
        removerErro(cep);

        // Mostra que está pesquisando
        endereco.value = "Buscando endereço...";
        bairro.value = "";
        cidade.value = "";
        estado.value = "";

        // Requisição assíncrona usando Fetch
        fetch(`https://viacep.com.br/ws/${cepNumeros}/json/`)
            .then(function (resposta) {

                if (!resposta.ok) {
                    throw new Error("Erro na comunicação com o servidor.");
                }

                return resposta.json();
            })

            .then(function (dados) {

                // Verifica se o CEP existe
                if (dados.erro) {

                    alert("CEP não encontrado.");

                    limparEndereco();

                    return;
                }

                // Preenche automaticamente os campos
                endereco.value = dados.logradouro || "";
                bairro.value = dados.bairro || "";
                cidade.value = dados.localidade || "";
                estado.value = dados.uf || "";

            })

            .catch(function (erro) {

                console.error("Erro:", erro);

                alert("Não foi possível consultar o CEP.");

                limparEndereco();
            });

    });


    // ==========================================
    // FORMATAÇÃO DO CEP
    // ==========================================

    cep.addEventListener("input", function () {

        let valor = cep.value.replace(/\D/g, "");

        if (valor.length > 5) {
            valor = valor.substring(0, 5) + "-" + valor.substring(5, 8);
        }

        cep.value = valor;
    });


    // ==========================================
    // VALIDAÇÃO DO FORMULÁRIO
    // ==========================================

    formulario.addEventListener("submit", function (event) {

        // Impede o recarregamento da página
        event.preventDefault();

        // Remove erros antigos
        limparErros();

        let formularioValido = true;


        // Nome
        if (nome.value.trim() === "") {

            mostrarErro(nome, "Digite o nome do produto.");

            formularioValido = false;
        }


        // Categoria
        if (categoria.value === "") {

            mostrarErro(categoria, "Selecione uma categoria.");

            formularioValido = false;
        }


        // Quantidade
        if (
            quantidade.value === "" ||
            Number(quantidade.value) <= 0
        ) {

            mostrarErro(
                quantidade,
                "Digite uma quantidade válida."
            );

            formularioValido = false;
        }


        // Preço
        if (
            preco.value === "" ||
            Number(preco.value) <= 0
        ) {

            mostrarErro(
                preco,
                "Digite um preço válido."
            );

            formularioValido = false;
        }


        // CEP
        const cepNumeros = cep.value.replace(/\D/g, "");

        if (cepNumeros.length !== 8) {

            mostrarErro(
                cep,
                "Digite um CEP válido com 8 números."
            );

            formularioValido = false;
        }


        // Se tudo estiver correto
        if (formularioValido) {

            alert("Cadastro realizado com sucesso!");

            formulario.reset();

            limparEndereco();
        }

    });


    // ==========================================
    // FUNÇÕES AUXILIARES
    // ==========================================

    function limparEndereco() {

        endereco.value = "";
        bairro.value = "";
        cidade.value = "";
        estado.value = "";
    }


    function mostrarErro(campo, mensagem) {

        removerErro(campo);

        campo.classList.add("erro");

        const mensagemErro = document.createElement("span");

        mensagemErro.classList.add("mensagem-erro");

        mensagemErro.textContent = mensagem;

        campo.parentElement.appendChild(mensagemErro);
    }


    function removerErro(campo) {

        campo.classList.remove("erro");

        const mensagem = campo.parentElement.querySelector(
            ".mensagem-erro"
        );

        if (mensagem) {
            mensagem.remove();
        }
    }


    function limparErros() {

        document
            .querySelectorAll(".mensagem-erro")
            .forEach(function (mensagem) {
                mensagem.remove();
            });

        document
            .querySelectorAll(".erro")
            .forEach(function (campo) {
                campo.classList.remove("erro");
            });
    }

});