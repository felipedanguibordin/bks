document.getElementById("search-btn").addEventListener("click", searchBook);
document
  .getElementById("search")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      searchBook();
    }
  });

function searchBook() {
  const query = document.getElementById("search").value;
  if (!query) {
    alert("Digite um nome de livro para buscar!");
    return;
  }

  fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.items && data.items.length > 0) {
        const book = data.items[0].volumeInfo;

        document.getElementById("livro-img").src =
          book.imageLinks?.thumbnail || "imgs/default-book.png";

        document.querySelector(".sinopse").textContent =
          book.description || "Sem sinopse disponível";

        // Esconder frase de "Próxima leitura" e exibir livro
        document.getElementById("proxima-leitura").classList.add("hidden");
        document.getElementById("livro-info").classList.remove("hidden");
      } else {
        alert("Nenhum livro encontrado.");
      }
    })
    .catch(() => {
      alert("Erro ao buscar livro. Tente novamente.");
    });
}

async function getSuggestions() {
  let query = document.getElementById("search").value;
  let suggestionsList = document.getElementById("suggestions");

  if (!query) {
    suggestionsList.innerHTML = "";
    return;
  }

  try {
    let response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${query}`
    );
    let data = await response.json();

    suggestionsList.innerHTML = "";

    if (data.items) {
      data.items.slice(0, 5).forEach((book) => {
        let title = book.volumeInfo.title;
        let li = document.createElement("li");
        li.innerText = title;
        li.onclick = function () {
          document.getElementById("search").value = title;
          suggestionsList.innerHTML = "";
          searchBook();
        };
        suggestionsList.appendChild(li);
      });
    }
  } catch (error) {
    console.error("Erro ao buscar sugestões:", error);
  }
}
