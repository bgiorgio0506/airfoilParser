import { existsSync, PathLike, readdirSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const airfoilFolderName = "coord_seligFmt"


function parseAirfoilDat(text:string){
    const textSplit = text.split("\n");
    const airfoilName = textSplit[0];
    const coordArr:any = [];
    for (let i = 1; i < textSplit.length; i++) {
        let coordSplit = textSplit[i].split(' ');
        coordSplit = coordSplit.filter( item => (item !== "" && item !=="\r"));
        coordArr.push({
            x:coordSplit[0], 
            y:(coordSplit[1])?coordSplit[1].substring(0 , coordSplit[1].length-1): ""
        });
        
    }

    return {
        name:airfoilName.substring(0, airfoilName.length-1), 
        shape:coordArr.filter((item:any) => (item.x !== "" && item.y !== ""))
    }
    
}


function enumarateFiles(folder:any){
    if(existsSync(folder)){
        const files = readdirSync(folder, {encoding:"utf-8"});
        return files;
    }return [];
}

function readFile(folder:PathLike, name:string){
    return readFileSync(resolve(folder.toString(), name), {encoding:"utf-8"});
}

function main(){
    const pathToAirfoil = resolve(__dirname, airfoilFolderName);
    const outPutFile = resolve(__dirname, 'res.json');
    const files = enumarateFiles(pathToAirfoil); 
    const res:any = [];
    for (let i = 0; i < files.length; i++) {
        const content = readFile(pathToAirfoil, files[i]);
        const airfoil = parseAirfoilDat(content);
        res.push(airfoil);
    }

    writeFileSync(outPutFile, JSON.stringify(res));

    return process.exit();

}

main();
