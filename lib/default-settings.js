module.exports = {
  metaExtension: '-meta.xml',
  staticresource: {
    generate: true,
    folderName: 'staticresources',
    extension: '.resource',
    name: 'appresources',
    assetsExtensions: ['.css', '.js', '.woff2', '.woff', '.svg', '.gif', '.png', '.jpg', '.jpeg', '.css.map', '.map'],
    metaTemplate: `<?xml version="1.0" encoding="UTF-8"?>
    <StaticResource xmlns="http://soap.sforce.com/2006/04/metadata">
        <cacheControl>Public</cacheControl>
        <contentType>application/x-zip-compressed</contentType>
    </StaticResource>`
  },
  page: {
    folderName: 'pages',
    generate: true,
    extension: '.page',
    name: 'index',
    appMountId: 'app',
    controller: null,
    template: `<apex:page
      <%= !!options.controller ? 'controller="'+ options.controller + '"' : '' %>
      showHeader="<%= (options.showHeader !== undefined) ? options.showHeader : true %>"
      sidebar="<%= (options.sidebar !== undefined) ? options.sidebar : true %>"
      standardStylesheets="<%= (options.standardStylesheets !== undefined) ? options.standardStylesheets : true %>"
      applyHtmlTag="<%= (options.applyHtmlTag !== undefined) ? options.applyHtmlTag : true %>"
      applyBodyTag="<%= (options.applyBodyTag !== undefined) ? options.applyBodyTag : true %>">

      <head>
        <% if(options['.css'] ) { %>
          <% options['.css'].reverse().forEach(function(name) { %>
            <apex:stylesheet value="{! URLFOR($Resource.<%= options.zipName %>, '<%= name %>') }" />
          <% }) %>
        <% } %>
      </head>
      <body>
        <% if(options.remoteObject) { %>
          <apex:remoteObjects jsNamespace="<%= options.remoteObject.namespace %>">
            <% Object.keys(options.remoteObject.models).forEach(function (modelName) { %>
              <% var packageName = options.remoteObject.models[modelName].packageName ? options.remoteObject.models[modelName].packageName + '__' : '' %>
              <% var fields = options.remoteObject.models[modelName].fields || options.remoteObject.models[modelName] %>
              <% var finalFields = fields.map((field) => { if(field.indexOf('__c') === -1 || !packageName) { return field; } return packageName + field; }).join(',') %>
              <apex:remoteObjectModel name="<%= packageName %><%= modelName %>" fields="<%= finalFields %>" />
            <% }) %>
          </apex:remoteObjects >
        <% } %>

        <% if (options.appMountId) { %>
          <div id="<%= options.appMountId%>"></div>
        <% } %>

        <script>
          window['<%= options.zipNameVar %>'] = '{! URLFOR($Resource.<%= options.zipName %>) }';
          window['<%= options.accessTokenVar %>'] = '{!$Api.Session_ID}';
          window['<%= options.userInfo %>'] = {
            display_name: '{! $User.FirstName } {! $User.LastName }',
            first_name: '{! $User.FirstName }',
            last_name: '{! $User.LastName }',
            nick_name: '{! $User.CommunityNickname }',
            addr_country: '{! $User.Country }',
            email: '{! $User.Email }',
            mobile_phone: '{! $User.MobilePhone }',
            user_id: '{! $User.Id }'
          };
          <%=
            !!options.customScript ?
            options.customScript :
            ''
          %>
        </script>

        <% if(options['.js'] ) { %>
          <% options['.js'].reverse().forEach(function(name) { %>
            <script src="{! URLFOR($Resource.<%= options.zipName %>, '<%= name %>') }"></script>
          <% }) %>
        <% } %>

        <% if(options['defaultScripts']) { %>
          <% options['defaultScripts'].forEach(function(name) { %>
            <script src="<%= name %>"></script>
          <% }) %>
        <% } %>
      </body>
    </apex:page>`,
    metaTemplate: `<?xml version="1.0" encoding="UTF-8"?>
    <ApexPage xmlns="http://soap.sforce.com/2006/04/metadata">
        <apiVersion>36.0</apiVersion>
        <availableInTouch>false</availableInTouch>
        <confirmationTokenRequired>false</confirmationTokenRequired>
        <label><%= options.label %></label>
    </ApexPage>`,
    metaTemplateOptions:{
      label: 'Index'
    },
    templateOptions: {
      showHeader: false,
      sidebar: false,
      standardStylesheets: false,
      applyHtmlTag: false,
      applyBodyTag: false,
      appMountId: 'app',
      accessTokenVar: 'SF_ACCESS_TOKEN',
      zipNameVar: 'SF_ZIP_NAME',
      userInfo: 'USER_INFO'
    }
  },
  sfPackage: {
    generate: true,
    extension: '.xml',
    name: 'package',
    template: `<?xml version="1.0" encoding="UTF-8"?>
    <Package xmlns="http://soap.sforce.com/2006/04/metadata">
        <% if(options['.page'] && options['.page'].length > 0 ) { %>
        <types>
          <% options['.page'].forEach(function (page) { %>
            <members><%= page %></members>
          <% }) %>
          <name>ApexPage</name>
        </types>
        <% } %>
        <% if(options['.resource'] && options['.resource'].length > 0 ) { %>
        <types>
          <% options['.resource'].forEach(function (resource) { %>
            <members><%= resource %></members>
          <% }) %>
          <name>StaticResource</name>
        </types>
        <% } %>
        <version><%= options.apiVersion %></version>
    </Package>`,
    templateOptions: {
      apiVersion: '36.0'
    }
  }
}
