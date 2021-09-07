let csvFile;
let listVille = [];
let nbPermutation = 0;
let nbComparaison = 0;

document.querySelector("#read-button").addEventListener('click', function () {
    csvFile = document.querySelector("#file-input").files[0];
    let reader = new FileReader();
    reader.addEventListener('load', function (e) {
        // récupération de la liste des villes
        listVille = getArrayCsv(e.target.result);

        // Calcul de la distance des villes par rapport à Grenoble
        listVille.forEach(ville => {
            ville.distanceFromGrenoble = distanceFromGrenoble(ville);
        });
        // Tri
        const algo = $("#algo-select").val();
        nbPermutation = 0;
        nbComparaison = 0;
        sort(algo);

        // Affichage 
        displayListVille()
    });
    reader.readAsText(csvFile)
})

/**
 * Récupére la liste des villes contenu dans le fichier csv
 * @param csv fichier csv brut
 * @returns la liste des villes mis en forme
 */
function getArrayCsv(csv) {
    let listLine = csv.split("\n")
    listVille = [];
    let isFirstLine = true;
    listLine.forEach(line => {
        if (isFirstLine || line === '') {
            isFirstLine = false;
        } else {
            let listColumn = line.split(";");
            listVille.push(
                new Ville(
                    listColumn[8],
                    listColumn[9],
                    listColumn[11],
                    listColumn[12],
                    listColumn[13],
                    0
                )
            );
        }
    });
    return listVille;
}

/**
 * Calcul de la distance entre Grenoble et une ville donnée
 * @param ville ville
 * @returns la distance qui sépare la ville de Grenoble
 */
function distanceFromGrenoble(ville) {
    const lat1 = 45.166667; //latitudeGrenoble
    const lon1 = 5.716667; //longitudeGrenoble
    const lat2 = ville.latitude;
    const lon2 = ville.longitude;

    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI/180; // φ, λ in radians
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    const d = R * c; // in metres

    return d;
}

/**
 * Retourne vrai si la ville i est plus proche de Grenoble
 * par rapport à j
 * @param {*} i distance de la ville i
 * @param {*} j distance de la ville j
 * @return vrai si la ville i est plus proche
 */
function isLess(i, j) {
    if (i.distanceFromGrenoble < j.distanceFromGrenoble) {
        return true;
    }
}

/**
 * interverti la ville i avec la ville j dans la liste des villes
 * @param {*} i 
 * @param {*} j 
 */
function swap(i, j) {
    let tmp = listVille[i];
    listVille[i] = listVille[j];
    listVille[j] = tmp;
}

function sort(type) {
    switch (type) {
        case 'insert':
            insertsort(listVille); // working
            break;
        case 'select':
            selectionsort(listVille); // working
            break;
        case 'bubble':
            bubblesort(listVille); // working
            break;
        case 'shell':
            shellsort(listVille); // working
            break;
        case 'merge':
            listVille = mergesort(listVille); // working
            break;
        case 'heap':
            heapsort(listVille, 0, listVille.length -1);
            break;
        case 'quick':
            quicksort(listVille); // working
            break;
    }
}

function insertsort(table) {
    for (let i = 0; i < table.length; i++) {
        let temp = table[i]
        let j = i
        while (j > 0 && isLess(temp, table[j - 1])) { // temp < table[j - 1] ==> isLess(i, j) with i.distanceFromGrenoble < j.distanceFromGrenoble
            //table[j] = table[j-1]
            swap(j, j-1)
            j = j - 1
        }
        table[j] = temp
    }
}

function selectionsort(table) {
    for (let i = 0; i < table.length; i++) {
        let min = i
        for (let j = i + 1; j < table.length; j++) {
            if (isLess(table[j], table[min])) {         // table[j] < table[min]
                min = j
            }
        }
        swap(i, min)
    }
}

function bubblesort(table) {
    let passage = 0
    let permut = true;
    while (permut) {
        permut = false
        for (let i = passage; i < table.length - 1; i++) {
            if (isLess(table [i + 1], table[i])){       // table [i + 1] < table[i]
                swap(i, i + 1)
                permut = true
            }
        }
    }
}

function shellsort(table) {
    let length = table.length
    let n = 0
    while (n < length) {
        n = 3 * n + 1
    }
    while (n != 0) {
        n = Math.floor(n / 3)
        for (let i = n; i < length; i++) {
            let value = table[i]
            let j = i
            while (j > n - 1 && isLess(value, table[j - n])){ // value < table[j - n]
                swap(j, j - n)
                j = j - n
            }
            table[j] = value
        }
    }
}

function mergesort(table) { // mergesort(table, start = 0, end = table.length -1)
    let n = table.length
    if (n <= 1) {
        return table
    } else {
        // let left = mergesort(table.slice(0, Math.floor(n / 2)))
        // let right = mergesort(table.slice(Math.floor(n / 2), n))
        // return merge(left, right)
        return merge(
            mergesort(table.slice(0, Math.floor(n / 2))),
            mergesort(table.slice(Math.floor(n / 2), n))
        )
    }
}

function merge(left, right) {
    if (left.length === 0) {
        return right
    } else if (right.length === 0) {
        return left
    } else if (isLess(left[0], right[0])) {       // left[0] <= right[0]
        return [left[0]].concat(merge(left.slice(1, left.length), right))
    } else {
        return [right[0]].concat(merge(left, right.slice(1, right.length)))
    }
}

function heapsort(table) {
    organize(table)
    for (let i = table.length - 1; i > 0; i--) {
        swap(0, i)
        down(table, i, 0)
    }
}

function organize(table) {
    for (let i = 0; i < table.length - 1; i++) {
        up(table, i)
    }
}

function up(table, index) {
    if (isLess(table[Math.floor(index / 2)], table[index])){    // table[Math.floor(index / 2)] < table[index]
        swap(index, Math.floor(index / 2))
        up(table, Math.floor(index / 2))
    }
}

function down(table, element, index) {
    let formule = 2 * index + 1
    let max
    if (formule < element) {
        if (isLess(table[2 * index], table[formule])) {             // table[2 * index] < table[formule]
            max = formule
        } else {
            max = 2 * index
        }
        if (isLess(table[index], table[max])) {                     // table[index] < table[max]
            swap(max, index)
            down(table, element, max)
        }
    }
}

function quicksort(table, first = 0, last = table.length - 1) {
    if (first < last) {
        let pi = part(table, first, last)
        quicksort(table, first, pi - 1)
        quicksort(table, pi + 1, last)
    }
}

function part(table, first, last) {
    let pivot = last
    let j = first
    for (let i = first; i < last; i++) {
        if (isLess(table[i], table[pivot])) { // table[i] <= table[pivot]
            swap(i, j)
            j = j + 1
        }
    }
    swap(last, j)
    return j
}

/** MODEL */

class Ville {
    constructor(nom_commune, codes_postaux, latitude, longitude, dist, distanceFromGrenoble) {
        this.nom_commune = nom_commune;
        this.codes_postaux = codes_postaux;
        this.latitude = latitude;
        this.longitude = longitude;
        this.dist = dist;
        this.distanceFromGrenoble = distanceFromGrenoble;
    }
}

/** AFFICHAGE */
function displayPermutation(nbPermutation) {
    document.getElementById('permutation').innerHTML = nbPermutation + ' permutations';
}

function displayListVille() {
    document.getElementById("navp").innerHTML = "";
    displayPermutation(nbPermutation);
    let mainList = document.getElementById("navp");
    for (var i = 0; i < listVille.length; i++) {
        let item = listVille[i];
        let elem = document.createElement("li");
        elem.innerHTML = item.nom_commune + " - \t" + Math.round(item.distanceFromGrenoble * 100) / 100 + ' m';
        mainList.appendChild(elem);
    }
}
