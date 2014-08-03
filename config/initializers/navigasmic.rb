Navigasmic.setup do |config|

  # Defining Navigation Structures:
  #
  # You can define your navigation structures and configure the builders in this initializer.
  #
  # When defining navigation here, it's important to understand that the scope is not the same as the view scope -- and
  # you should use procs where you want things to execute in the view scope.
  #
  # Once you've defined some navigation structures and configured your builders you can render navigation in your views
  # using the `semantic_navigation` view helper.  You can also use the same syntax to define your navigation structures
  # in your views -- and eventually move them here if you want.
  #
  # <%= semantic_navigation :primary %>
  #
  # You can optionally provided a :builder and :config option to the semantic_navigation view helper.
  #
  # <%= semantic_navigation :primary, config: :blockquote %>
  # <%= semantic_navigation :primary, builder: Navigasmic::Builder::MapBuilder %>
  #
  # When defining navigation in your views just pass it a block.
  #
  # <%= semantic_navigation :primary do |n| %>
  #   <% n.item 'About Me' %>
  # <% end %>
  #
  # Here's a basic example:
  config.semantic_navigation :primary do |n|

    n.item 'Голимчики', controller: 'golimos'
    n.item 'Dashboard', controller: 'dashboard'
    n.item 'Задачи', controller: 'tasks'
    n.item 'Пользователи', controller: 'users', hidden_unless: proc{ current_role.manager? }


    # Groups and Items:
    #
    # Create navigation structures using the `group`, and `item` methods.  You can nest items inside groups or items.
    # In the following example, the "Articles" item will always highlight on the blog/posts controller, and the nested
    # article items will only highlight on those specific pages.  The "Links" item will be disabled unless the user is
    # logged in.
    #
    #n.group 'Blog' do
    #  n.item 'Articles', controller: '/blog/posts' do
    #    n.item 'First Article', '/blog/posts/1'
    #    n.item 'Second Article', '/blog/posts/2', map: {changefreq: 'weekly'}
    #  end
    #  n.item 'Links', controller: '/blog/links', disabled_if: proc{ !logged_in? }
    #end
    #
    # You can hide specific specific items or groups, and here we specify that the "Admin" section of navigation should
    # only be displayed if the user is logged in.
    #
    #n.group 'Admin', hidden_unless: proc{ logged_in? } do
    #  n.item 'Manage Posts', class: 'posts', link_html: {data: {tools: 'posts'}}
    #end
    #
    # Scoping:
    #
    # Scoping is different than in the view here, so we've provided some nice things for you to get around that.  In
    # the above example we just provide '/' as what the home page is, but that may not be correct.  You can also access
    # the path helpers, using a proc, or by proxying them through the navigation object.  Any method called on the
    # navigation scope will be called within the view scope.
    #
    #n.item 'Home', proc{ root_path }
    #n.item 'Home', n.root_path
    #
    # This proxy behavior can be used for I18n as well.
    #
    #n.item n.t('hello'), '/'

  end


  # Setting the Default Builder:
  #
  # By default the Navigasmic::Builder::ListBuilder is used unless otherwise specified.
  #
  # You can change this here:
  #config.default_builder = MyCustomBuilder


  # Configuring Builders:
  #
  # You can change various builder options here by specifying the builder you want to configure and the options you
  # want to change.
  #
  # Changing the default ListBuilder options:
  #config.builder Navigasmic::Builder::ListBuilder do |builder|
  #  builder.wrapper_class = 'semantic-navigation'
  #end


  config.builder navi: Navigasmic::Builder::ListBuilder do |builder|

    builder.wrapper_tag = :nav
    builder.wrapper_class = nil
    builder.item_class = 'menu-link'
    builder.highlighted_class = 'is-active'

    builder.label_generator = proc{ |label, options, has_link, has_nested| "#{label}" }
    builder.link_generator = proc{ |label, link, options, is_nested| label }
    builder.item_generator = proc{ |label, link, content, options, tag| link_to(label, link, options) }
    
  end

end
