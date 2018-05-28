
console.log("type command:");
var currentTxnCache = new Map();
var command, key, value;
var txnCacheArray = [];

//add main txn cache to array
txnCacheArray.push(currentTxnCache);

process.stdin.on("data", function(data) {
    //process.stdout.write(data.toString().trim());
    var input = data.toString().trim();
    var splits = input.split(' ', 3);
    //process.stdout.write(splits.toString());

    if(splits[0] === "GET" && splits.length === 2) {
        command = splits[0];
        key = splits[1];
        value = getKey(key);
        process.stdout.write("| " + input + " | "+ value + " |\n");
    }
    else if(splits[0] === "SET" && splits.length === 3) {
        command = splits[0];
        key = splits[1];
        value = splits[2];
        if(getKey() == null) {
            setKey(key, value);
        }
        process.stdout.write("| " + input + " |  |\n");
    }
    else if(splits[0] === "UNSET" && splits.length === 2) {
        command = splits[0];
        key = splits[1];
        if(getKey(key) != null) {
            unsetKey(key);
            process.stdout.write("| " + input + " |  |\n");
        } else {
            process.stdout.write("Not Found Key: " + key  + "\n\n");
        }
    }
    else if (splits[0] === "NUMEQUALTO" && splits.length === 2) {
        command = splits[0];
        value = splits[1];
        var count = getKeyValueCount(value);
        process.stdout.write("| " + input + " | "+ count + " |\n");
    }
    else if(splits[0] === "BEGIN" && splits.length === 1) {
        command = splits[0];
        currentTxnCache = new Map();
        if(txnCacheArray != null && txnCacheArray.length >= 1) {
            txnCacheArray.forEach(cacheElement => {
                cacheElement.forEach(function(value, key, eleMap){
                    currentTxnCache.set(key, value);
                });
            });
        } 
        txnCacheArray.push(currentTxnCache);
    }
    else if (splits[0] === "COMMIT" ) {
        tempCache = currentTxnCache;
        if( txnCacheArray != null && txnCacheArray.length <= 1) {
            process.stdout.write("NO TRANSACTION: "  + "\n\n");
        } else {
            //commit all nested transactions
            while( txnCacheArray != null && txnCacheArray.length > 1) {
                tempCache = txnCacheArray.pop();
                currentTxnCache = getCurrentTransaction();
                //set current txn cache to parent txn
                if( currentTxnCache != null) {
                    tempCache.forEach(function (value, key, mapObj) {
                        setKey(key, value);
                    });
                }
            }
        }
        currentTxnCache = getCurrentTransaction();
    }
    else if (splits[0] === "ROLLBACK" ) {
        if( txnCacheArray.length > 1) {
            txnCacheArray.pop(); 
        }
        else {
            process.stdout.write("NO TRANSACTION: "  + "\n\n");
        }
        currentTxnCache = getCurrentTransaction();
    }
    else if (splits[0] === "END") {
        process.stdout.write("PROGRAM EXITED: "  + "\n\n");
        process.exit();
    }
    else {
        process.stderr.write("command error.\n\n");
    }
});

function setKey(key, value) {
    currentTxnCache.set(key, value);
}

function unsetKey(key) {
    currentTxnCache.delete(key);
}

function getKey(key) {
    if(currentTxnCache.get(key) == undefined) {
        return null;
    } else {
        return currentTxnCache.get(key);
    }
}

function getKeyValueCount(value) {
    var count = 0;
    currentTxnCache.forEach(element => {
        console.log(element);
        if(element == value) {
            count++;
        }
    });
    return count;
}

function getCurrentTransaction() {
    if(txnCacheArray != null && txnCacheArray.length >= 1) {
        return txnCacheArray[txnCacheArray.length -1];
    }
}