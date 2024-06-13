import axios from "axios";
import 'dotenv/config';

const authorize = async (shop) => {
    const clientId = process.env.CLIENT_ID;
    const redirectUri = process.env.REDIRECT_URI;
    const shopName = process.env.SHOP_NAME;
    
    return encodeURI(`https://${shopName}/admin/oauth/authorize?client_id=${clientId}&scope=${process.env.SCOPES}&redirect_uri=${redirectUri}`);
};

const redirect = async (code) => {
    console.log(code);
    // Implement the logic for handling the redirect here
};

export { authorize, redirect };
