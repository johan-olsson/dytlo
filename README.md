dytlo
=====

*A tiny template langue that does any thing you want.
*

dytlo has the size of 1.5kb minified, does not have any dependencies and does not poke at the prototype of your DOM.

Usage
------------------------------------------

The idea of dytlo is to allow the developer to create the template functionality they want to use.

###Rules

*Creating a rule / setting up some functionality:
*
```
#!javascript
// dytlo.rule( <rule prefix>, <behavior function> )
dytlo.rule('?', function(object) {
  // object will have the parameters: node, name, index, render and depth
  return (typeof object.value !== 'undefined')? object.render : '' ;
});
```
Now we have our first rule. So how do we use it? The rules that you create in this way will apply for both template- "blocks" and "variables" 
```{?foo} bar {/?foo}``` and ```{?foo}```

*Assume we have the json:
*
```
#!javascript
{
  "name": "Andy",
  "title": "Web Developer"
}
```
*And the template:
*
```
<h3>{ name }{ ?title } - <span>{ /?title }{ ?title }{ ?title }</span>{ /?title }<h3>
```
*The output would be:
*
```
<h3>Andy - <span>Web Developer</span></h3>
```
Now you might think *"that's a lot of titles"*.
*So let's create a more specific rule for this:
*
```
#!javascript
// I'm using "^^" as a prefix this time
dytlo.rule('^^', function(object) {
  return (typeof object.value !== 'undefined')? ' - <span>' + object.render + '</span>' : '' ;
});
```
*And the new template:
*
```
<h3>{ name }{ ^^title }</h3>
```
*The output again would be:
*
```
<h3>Andy - <span>Web Developer</span></h3>
```

###Loops

*Some json:
*
```
#!javascript
{
  "users": [
    {
      "name": "Andy",
      "title": "Web Developer"
    },
    {
      "name": "Bob",
      "title": "QA"
    },
    {
      "name": "Cesar",
      "title": "Project Manager"
    }
  ],
  "class": "valid_user",
  "company": {
    "name": "Atlassian"
  }
}
```
*This is how to do this in the template:
*
```
#!html
<ul>
  { @users } <!-- @ is the pre set loop prefix -->
  <li>
    <h3>{{ name }} - {{ title }}</h3> <!-- observe the use of two "{" and "}" this 
                                      indicate that we are deeper in the json -->

    <span class="{ class }"> <!-- here we only use one "{" and "}" this means we
                             trying access a node at the same depth as "users" -->

      { company.name } <!-- this will access the attribute name on 
                       the node company at the same depth as "users" -->
    </span>
  </li>
  { /@users }
</ul>
```
*The result of this will be (except the comments will not be removed):
*
```
<ul>
  <li>
    <h3>Andy - Web Developer</h3>
    <span class="valid_user">
      Atlassian
    </span>
  </li>
  <li>
    <h3>Bob - QA</h3>
    <span class="valid_user">
      Atlassian
    </span>
  </li>
  <li>
    <h3>Cesar - Project Manager</h3>
    <span class="valid_user">
      Atlassian
    </span>
  </li>
</ul>
```

