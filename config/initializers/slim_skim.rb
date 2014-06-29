Slim::Engine.set_default_options :shortcut => 
  {
    '@' => {:attr => 'data-pi'}, 
    '#' => {:attr => 'id'}, 
    '.' => {:attr => 'class'}
  }

Slim::Engine.default_options[:pretty] = true

Skim::Engine.default_options[:use_asset] = true