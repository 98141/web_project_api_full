class Api {
  constructor(options) {
    // cuerpo del constructor
    this.baseUrl = options.baseUrl;
    this.headers = options.headers;
  }
  // 1. Cargar la información del usuario desde el servidor
  getUserInfo() {
    return fetch(this.baseUrl + "/users/me", {
      headers: {...this.headers, authorization: 'Bearer ' + localStorage.getItem('jwt')},
    })
      .then((res) => {
        if (!res.ok) {
          return Promise.reject(`Error: ${res.status}`);
        }
        return res.json();
      })
      .then((result) => {
        return result;
      });
  }

  // 2. Cargar las tarjetas desde el servidor(Obtener tarjetas iniciales)
  getInitialCards() {
    return fetch(this.baseUrl + "/cards", {
      headers: {...this.headers, authorization: 'Bearer ' + localStorage.getItem('jwt')},
    })
      .then((res) => {
        if (!res.ok) {
          return Promise.reject(`Error: ${res.status}`);
        }
        return res.json();
      })
      .then((result) => {
        return result;
      });
  }

  // 3. Editar el perfil
updateUserProfile({ name, about }) {
  return fetch(this.baseUrl + "/users/me", {
    method: "PATCH",
    headers: {...this.headers, authorization: 'Bearer ' + localStorage.getItem('jwt')},
    body: JSON.stringify({ name, about }),
  })
  .then((res) => {
    if (!res.ok) {
      return Promise.reject(`Error: ${res.status}`);
    }
    return res.json();
  });
}

  //4. Agregar una nueva tarjeta
addNewCard({ name, link }) {
  return fetch(this.baseUrl + "/cards", {
    method: "POST",
    headers: {...this.headers, authorization: 'Bearer ' + localStorage.getItem('jwt')},
    body: JSON.stringify({ name, link }),
  })
    .then((res) => {
      if (!res.ok) {
        return res
          .json()
          .then((err) =>
            Promise.reject(`Error: ${err.message || res.status}`)
          );
      }
      return res.json();
    })
    .catch((err) => {
      console.error("Error al agregar la tarjeta:", err);
      return Promise.reject(err);
    });
}

  //5. Alternar "me gusta" en una tarjeta
  toggleLike(cardId, isLiked) {
    return fetch(`${this.baseUrl}/cards/${cardId}/likes`, {
      method: isLiked ? "DELETE" : "PUT",
      headers: {...this.headers, authorization: 'Bearer ' + localStorage.getItem('jwt')},
    })
      .then((res) => {
        if (!res.ok) {
          return Promise.reject(`Error: ${res.status}`);
        }
        return res.json();
      })
      .catch((err) => {
        console.error("Error al alternar 'me gusta api':", err);
        return Promise.reject(err);
      });
  }

  // 6. Actualizar el avatar del usuario
  updateUserAvatar(avatarUrl) {
    return fetch(this.baseUrl + "/users/me/avatar", {
      method: "PATCH",
      headers: {...this.headers, authorization: 'Bearer ' + localStorage.getItem('jwt')},
      body: JSON.stringify({ avatar: avatarUrl }),
    })
      .then((res) => {
        if (!res.ok) {
          return Promise.reject(`Error: ${res.status}`);
        }
        return res.json();
      })
      .then((result) => {
        return result;
      });
  }

  //7. Eliminar una tarjeta
  removeCard(cardId) {
    return fetch(`${this.baseUrl}/cards/${cardId}`, {
      method: "DELETE",
      headers: {...this.headers, authorization: 'Bearer ' + localStorage.getItem('jwt')},
    }).then((res) => {
      if (!res.ok) {
        return Promise.reject(`Error: ${res.status}`);
      }
      return res.json();
    });
  }
}

export const api = new Api({
  baseUrl: "https://around-api.es.tripleten-services.com/v1",
  headers: {
    authorization: "325345fd-94b5-413f-a03a-0fa1d6525595",
    "Content-Type": "application/json",
  },
});