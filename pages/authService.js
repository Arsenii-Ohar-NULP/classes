class AuthService{
    constructor(accessTokenKey){
        this.accessTokenKey = accessTokenKey;
    }

    getAccessToken(){
        return localStorage.getItem(this.accessTokenKey);
    }
}

export { AuthService };