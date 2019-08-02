import { API_BASE_URL, ACCESS_TOKEN } from '../constants';

const request = (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*"
    })
    
    if(localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }

    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
    .then(response => 
        response.json().then(json => {
            if(!response.ok) {
                return Promise.reject(json);
            }
            return json;
        })
    );
};

export function login(loginRequest) {
    console.log(loginRequest)
    console.log(JSON.stringify(loginRequest))
    return request({
        url: "http://localhost:8080/users/signin",
        method: 'POST',
        body: JSON.stringify(loginRequest)
    });
}


export function getCurrentUser() {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }
    return request({
        url: API_BASE_URL + "/users/me",
        method: 'GET'
    });
}

export function getMovieProfile(id) {
    return request({
        url: API_BASE_URL + "/movies/" + id,
        method: 'GET'
    });
}

export function getRoleProfile(id) {
    return request({
        url: API_BASE_URL + "/roles/" + id,
        method: 'GET'
    });
}

export function getDirectorProfile(id) {
    return request({
        url: API_BASE_URL + "/directors/" + id,
        method: 'GET'
    });
}

export function getUserProfile(id) {
    return request({
        url: API_BASE_URL + "/users/" + id,
        method: 'GET'
    });
}

export function getPlaceProfile(id) {
    return request({
        url: API_BASE_URL + "/places/" + id,
        method: 'GET'
    });
}

export function getPlaces() {
    return request({
        url: API_BASE_URL + "/places",
        method: 'GET'
    });
}

export function getRoles() {
    return request({
        url: API_BASE_URL + "/roles",
        method: 'GET'
    });
}

export function getMovies() {
    return request({
        url: API_BASE_URL + "/movies",
        method: 'GET'
    });
}

export function getDirectorsMovies(id) {
    return request({
        url: API_BASE_URL + "/directors/" + id + "/movies",
        method: 'GET'
    });
}

export function getUsers() {
    return request({
        url: API_BASE_URL + "/users",
        method: 'GET'
    });
}

export function getDirectors() {
    return request({
        url: API_BASE_URL + "/directors",
        method: 'GET'
    });
}

export function getLists() {
    return request({
        url: API_BASE_URL + "/movieLists",
        method: 'GET'
    });
}

export function addUser(formRequest) {
    return request({
        url: API_BASE_URL + "/users",
        method: 'POST',
        body: JSON.stringify(formRequest)
    });
}

export function addRole(formRequest) {
    return request({
        url: API_BASE_URL + "/roles",
        method: 'POST',
        body: JSON.stringify(formRequest)
    });
}

export function addPlace(formRequest) {
    return request({
        url: API_BASE_URL + "/places",
        method: 'POST',
        body: JSON.stringify(formRequest)
    });
}

export function addMovieList(formRequest) {
    return request({
        url: API_BASE_URL + "/movieLists",
        method: 'POST',
        body: JSON.stringify(formRequest)
    });
}

export function addDirector(formRequest) {
    return request({
        url: API_BASE_URL + "/directors",
        method: 'POST',
        body: JSON.stringify(formRequest)
    });
}

export function addMovieToList(formRequest,id,mid) {
    return request({
        url: API_BASE_URL + "/users/" + id + "/movie/" + mid,
        method: 'POST',
        body: JSON.stringify(formRequest)
    });
}

export function addImdbMovie(formRequest) {
    console.log(JSON.stringify(formRequest));
    return request({
        url: API_BASE_URL + "/movies/imdb",
        method: 'POST',
        body: JSON.stringify(formRequest)
    });
}

export function updateUser(formRequest,id) {
    console.log(JSON.stringify(formRequest));
    return request({
        url: API_BASE_URL + "/users/" + id,
        method: 'PUT',
        body: JSON.stringify(formRequest)
    });
}


export function updateRole(formRequest,id) {
    return request({
        url: API_BASE_URL + "/roles/" + id,
        method: 'PUT',
        body: JSON.stringify(formRequest)
    });
}

export function updatePlace(formRequest,id) {
    return request({
        url: API_BASE_URL + "/places/" + id,
        method: 'PUT',
        body: JSON.stringify(formRequest)
    });
}

export function updateDirector(formRequest,id) {
    return request({
        url: API_BASE_URL + "/directors/" + id,
        method: 'PUT',
        body: JSON.stringify(formRequest)
    });
}

export function updateMovieList(formRequest,id) {
    return request({
        url: API_BASE_URL + "/movieLists/" + id,
        method: 'PUT',
        body: JSON.stringify(formRequest)
    });
}


export function getListFromUser(id){
    return request({
        url: API_BASE_URL + "/users/" + id + "/lists",
        method: 'GET'
    });
}

export function getMoviesFromList(id,lid){
    return request({
        url: API_BASE_URL + "/users/" + id + "/lists/" + lid,
        method: 'GET'
    });
}

export function getListFromId(id){
    return request({
        url: API_BASE_URL + "/movieLists/" + id,
        method: 'GET'
    });
}

export function deleteMovieFromList(id,lid,mid){
    return request({
        url: API_BASE_URL + "/users/" + id + "/list/" + lid + "/movie/" + mid,
        method: 'DELETE'
    });
}

export function deleteMovie(id){
    return request({
        url: API_BASE_URL + "/movies/" + id,
        method: 'DELETE'
    });
}
export function deleteRole(id){
    return request({
        url: API_BASE_URL + "/roles/" + id,
        method: 'DELETE'
    });
}

export function deleteMovieList(id){
    return request({
        url: API_BASE_URL + "/movieLists/" + id,
        method: 'DELETE'
    });
}

export function deletePlace(id){
    return request({
        url: API_BASE_URL + "/places/" + id,
        method: 'DELETE'
    });
}

export function deleteDirector(id){
    return request({
        url: API_BASE_URL + "/directors/" + id,
        method: 'DELETE'
    });
}

export function deleteUser(id){
    return request({
        url: API_BASE_URL + "/users/" + id,
        method: 'DELETE'
    });
}

export function checkUsernameAvailability(username) {
    return request({
        url: API_BASE_URL + "/users/checkUsernameAvailability/" + username,
        method: 'GET'
    });
}