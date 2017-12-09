this["JST"] = this["JST"] || {};

this["JST"]["board"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"lists\">	</div><div class=\"board_item\">	<div id=\"new_list_form\">		<form>			<input type=\"text\" id=\"listName\" placeholder=\"Add a list...\">			<input type=\"submit\" value=\"Save\" class=\"save\">			<div id=\"cancel\">X</div>		</form>	</div><div id=\"list_form_toggle\">Add a list...</div></div>";
},"useData":true});

this["JST"]["card"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "";
},"useData":true});

this["JST"]["list"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "<div class=\"board_item\">	<div class=\"list\">		<h1>"
    + container.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + "</h1>		<div class=\"cards\">			"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.cards : depth0),{"name":"each","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "		</div>		<div id=\"new_card_form\">			<form>				<input type=\"textarea\" id=\"cardName\">				<input type=\"submit\" value=\"Add\" class=\"save\">				<div id=\"cancel\">X</div>			</form>		</div>		<div class=\"card_form_toggle\">Add a card...</div>	</div></div>";
},"2":function(container,depth0,helpers,partials,data) {
    var helper;

  return "			<div class=\"card\">				<h2>"
    + container.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"title","hash":{},"data":data}) : helper)))
    + "</h2><span class=\"icon_pencil\"></span>			</div>			";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.lists : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"useData":true});