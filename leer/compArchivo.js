const csv = require('csv-parser');
const fs = require('fs');
const { calcMedia, valCodigo, sobrePais, bajoPais } = require('../estadisticas/calculos');
let leerArchivo = (archivo, anio, pais) => {
    suscrip = [];
    nom = [];
    cod = [];
    fs.createReadStream(archivo)
        .pipe(csv())
        .on('data', (row) => {
            if (row[Number(Number(anio) - 1956)] != anio && row[Number(Number(anio) - 1956)] != undefined && row[Number(Number(anio) - 1956)] != 0) {
                nom.push(row[0]);
                cod.push(row[1]);
                suscrip.push(row[Number(Number(anio) - 1956)]);
            }

        })
        .on('end', () => {

            var mediaMundial = calcMedia(suscrip);
            var valorCodigo = valCodigo(cod, pais);
            var valorPais = suscrip[valorCodigo];
            var nombrePais = nom[valorCodigo];
            var estado = "";

            if (valorPais < mediaMundial) {
                estado = "Menor";
            } else {
                if (valorPais > mediaMundial) {
                    estado = "Mayor";
                } else {
                    estado = "Igual";
                }
            }

            mayores = [];
            menores = [];
            top = [];

            mayores = sobrePais(suscrip, valorPais, cod);
            menores = bajoPais(suscrip, valorPais, cod);
            console.log(`\nMedia de suscripciones en el año ${anio} es ${mediaMundial}`);
            console.log(`\nEl valor de las suscripciones del país ${nombrePais} con código ${pais} y valor ${valorPais} es ${estado} al promedio mundial`);
            console.log(`\nLos cinco paises por encima del valor de suscripciones de ${nombrePais} son: `);
            for (var x in mayores) {
                numb = mayores[x];
                console.log("Codigo : " + cod[numb] + ", Suscripcion: " + suscrip[numb] + ", Nombre: " + nom[numb]);
            }
            console.log(`\nLos cinco paises por debajo del valor de suscripciones de ${nombrePais} son: `);
            for (var x in menores) {
                numb = menores[x];
                console.log("Codigo : " + cod[numb] + ", Suscripcion: " + suscrip[numb] + ", Nombre: " + nom[numb]);
            }
        });
}

let compArchivo = (archivo) => {
    return new Promise((resolve, reject) => {
        fs.access(archivo, (err) => {
            if (!err) {
                resolve(archivo);
                return;
            }
            reject(null);
        });
    })
}

module.exports = {
    compArchivo,
    leerArchivo
}