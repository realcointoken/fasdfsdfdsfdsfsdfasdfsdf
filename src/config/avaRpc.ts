import fetch from "node-fetch";
import { Avalanche } from "avalanche";
import dotenv from "dotenv";
dotenv.config();

const {
  AVA_NODE_URL,
  AVA_NODE_PORT,
  AVA_NETWORK_ID,
  AVA_CHAIN_ID,
  AVA_CONNECTION_TYPE,
  ACCOUNT_USERNAME,
  ACCOUNT_PASSWORD,
} = process.env;

const avaRpc = {
  call: async (path: string, method: string, params: object) => {
    const settings = {
      method: "POST",
      body: JSON.stringify({
        method,
        id: 1,
        jsonrpc: "2.0",
        params,
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(
      `${AVA_CONNECTION_TYPE}://${AVA_NODE_URL}:${AVA_NODE_PORT}/${path}`,
      settings,
    );
    return response.json();
  },
  get: async (path: string) => {
    const settings = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    // console.log('making rpc call: ', settings)
    const response = await fetch(
      `https://explorerapi.avax-test.network/${path}`,
      settings,
    );

    return response.json();
  },
  getAvalanche: () => {
    return new Avalanche(
      String(AVA_NODE_URL),
      Number(AVA_NODE_PORT),
      String(AVA_CONNECTION_TYPE),
      Number(AVA_NETWORK_ID),
      String(AVA_CHAIN_ID),
    );
  },
  getUserCreds: () => ({
    username: ACCOUNT_USERNAME,
    password: ACCOUNT_PASSWORD,
  }),
};

export default avaRpc;
