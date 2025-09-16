import { fetchJson } from './fetchJson';

let commonUrl="http://localhost:5000/api"
export const FplService = {

    getBootstrapData: async () =>{
        return fetchJson(`${commonUrl}/bootstrap`)
    },

    getFixtureData: async () =>{
         return fetchJson(`${commonUrl}/fixtures`)
    }

};