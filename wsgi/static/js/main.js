var payments = [];
var id = 0;
function commit() {
    p = get_form_data();
    p.id = id++;

    payments.push(p);
    data = JSON.stringify(payments);
    $('#json').html(data);
    clear_form();

    row = document.createElement("span");
    row.id = "payment_" + p.id;
    row.className = "tbody row"
    creditor = document.createElement("span");
    creditor.className = "cell";
    creditor.innerHTML = p.creditor;
    amount = document.createElement("span");
    amount.className = "cell";
    amount.innerHTML = p.amount;
    debtors = document.createElement("span");
    debtors.className = "cell";
    debtors.innerHTML = p.debtors;
    comment = document.createElement("span");
    comment.className = "cell";
    comment.innerHTML = p.comment;
    links = document.createElement("span");
    links.className = "cell";
    edit_link = document.createElement("input");
    edit_link.addEventListener("click", function(){edit_payment(row.id)});
    edit_link.value = "edit";
    edit_link.type = "button";
    remove_link = document.createElement("input");
    remove_link.addEventListener("click", function(){remove_payment(row.id)});
    remove_link.value = "×";
    remove_link.type = "button";
    links.appendChild(edit_link);
    links.appendChild(remove_link);
    row.appendChild(creditor);
    row.appendChild(amount);
    row.appendChild(debtors);
    row.appendChild(comment);
    row.appendChild(links);
    $("#payments").append(row);
}

function edit_payment(id) {
    $("#"+id).remove();
    num_id = id.split('_')[1];
    p = find_payment(num_id);
    $("#creditor").val(p.creditor);
    $("#amount").val(p.amount);
    $("#debtors").val(p.debtors);
    $("#comment").val(p.comment);
    remove_payment(id);
}

function remove_payment(id) {
    $("#"+id).remove();
    num_id = id.split('_')[1];
    var i=0;
    while(item = payments[i]) {
        if (item.id == num_id) { break; }
        i++;
    }
    if (i < payments.length) {
        payments.splice(i, 1);
    }
    data = JSON.stringify(payments);
    $('#json').html(data);
}

function reduce() {
    data = JSON.stringify(payments);
    $('#json').html(data);
    $("#result").load("/reduce", {p:data});
}

function find_payment(id) {
    var p = null;
    var i = 0;
    while(item = payments[i]) {
        if (item.id == id) {
            return payments[i];
        }
        i++;
    }
    return null;
}

function clear_form() {
    $("#creditor").val("");
    $("#amount").val("");
    $("#debtors").val("");
    $("#comment").val("");
}

function get_form_data() {
    p = {
        creditor : "",
        amount   : 0,
        debtors  : [],
        comment  : ""
    };
    p.creditor = $("#creditor").val().trim();
    p.amount = parseFloat($("#amount").val());
    p.debtors = $("#debtors").val();
    p.debtors = p.debtors.split(",").map(function(i){return i.trim()});
    p.comment = $("#comment").val().trim();
    return p;
}
