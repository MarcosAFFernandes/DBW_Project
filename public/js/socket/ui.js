console.log("connect");
//Aqui apanhamos todas as referencias HTML da nossa página socket.ejs. Utilizamos a palavra reservada "export" para exportar cada uma destas váriaveis.
export let mensagem = document.getElementById("mensagens"); //textearea
export let form = document.getElementsByClassName("myForm"); //from
export let output = document.getElementById("output"); //paragrafo