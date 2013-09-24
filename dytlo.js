var dytlo = (function() {

	var rules = {};

    function id(prefix) {
        var i = 0, l = prefix.length, r = '';
        for (; i < l; i++) {
            r += prefix.charCodeAt(i).toString();
        }
        return r;
    }

    function loop(html, loop_node, depth, loop_name) {
        var r = '', k;
        for (k in loop_node[loop_name]) {
            if (loop_node[loop_name].hasOwnProperty(k)) {
                r += render(html, loop_node[loop_name][k], depth + 1, k);
            }
        }
        return render(render(r, loop_node[loop_name], depth + 1), loop_node, depth);
    }

    function render(html, loop_node, depth, index) {
        depth = (typeof depth !== 'undefined')?depth:1;
        if (html) {
            html = html.replace(/({+)\s*([^\w\/\s}]*)\s*([^}\s]*)\s*}+(([\W\w\n]*)\1\s*\/\2\s*\3\s*}+)?/gim, function(m, d, prefix, loop_name, c, block) {
                if (depth !== d.length) {
                    return m;
                }
                var nodes = loop_name.split('.'), node = loop_node, name = loop_name, i = 0, l;
                if (nodes.length > 1) {
                    l = nodes.length - 1;
                    for (; i < l; i++) {
                        if (typeof node[nodes[i]] === 'undefined') {
                            return m;
                        }
                        node = node[nodes[i]];
                    }
                    name = nodes[i];
                }
                switch((!block)?(!loop_name)?'var':'custom':(prefix === '@')?'loop':'custom') {
                    case 'loop':
                        return loop(block, loop_node, depth, loop_name);
                    case 'var':
                        switch(prefix) {
                            case '@':
                                return loop_node;
                            case '#':
                                return index;
                        }
                    break;
                    case 'custom':
                        if (rules.hasOwnProperty(id(prefix)) && typeof node === 'object') {
                            return rules[id(prefix)]({
                                'value': node[name],
                                'node': node,
                                'name': name,
                                'index': parseInt(index, 10),
                                'render': (block)?render(block, node, depth, name):node[name],
                                'depth': depth
                            });
                        }
                        return (typeof node[name] !== 'undefined')?node[name]:m;
				}
            });
        }
        return html;
    }
    return {
        render: render,
        rule: function(prefix, func) {
			rules[id(prefix)] = func;
			return this;
        },
        removeRule: function(prefix) {
            delete rules[id(prefix)];
			return this;
        }
    };
}());
