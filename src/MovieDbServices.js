export default  class MovieDbServices {
    _apiBase = `https://api.themoviedb.org/3`;

    api_key = '?api_key=87dfa1c669eea853da609d4968d294be';



    async getResourse(url) {
        const res = await fetch(`${this._apiBase}${url}${this.api_key}`);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}` +
                `, received ${res.status}`)
        }
        return await res.json();
    }

    async getResourseNext(url, page) {
        const res =  await fetch(`${this._apiBase}${url}${this.api_key}&page=${page}`);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}` +
                `, received ${res.status}`)
        }
        return await res.json();
    }


}


