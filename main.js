import {server} from './src/www/server.js';
import { getEnvironmentalVariable } from './src/config/envConfig.js';


const PORT = getEnvironmentalVariable('PORT');

(() => {
    server.listen(PORT, () =>{
        console.log(`Server is running on http://localhost:${PORT}`);
    })
})();