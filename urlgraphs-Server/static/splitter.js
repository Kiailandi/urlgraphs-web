function SendToGraph(res)
{
    if(res != undefined){
        console.log(res);
        res = res.replace(/"/g, '');
        res = res.replace(':', '*');
        res = res.replace(':', '*');
        res = res.replace('*', ':');
        var source = res.split('*');
        console.log(source);
        var targets = source[1].split(',');
        for (var i in targets){
            window.add(source[0], targets[i]);
        }
    }

}