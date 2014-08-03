module InputHelper
    
  ## todo @optimize dry the helpers!

  def search_field(val = 'keyword', placeholder ='', options = {})
    merge_class! options,'search-field text-input-wrap'
    content_tag(:div, nil, options) do
      concat text_field(val,nil,class: 'text-input', placeholder: placeholder)
      concat fa_icon('times')
    end
  end

  def text_input_wrap(options={}, &block)
    merge_class! options, 'text-input-wrap'
    content_tag(:div, nil, options) do
      concat capture(&block)
    end
  end

  def text_input(name = nil, placeholder ='', klass ='', options = {})
    merge_class! options, 'text-input-wrap '+ klass
    content_tag(:div, nil, options) do
      concat text_field_tag(name, nil,  class: 'text-input '+(klass.blank? ? '' : klass+'-input'), placeholder: placeholder)
    end
  end

  def email_input(name = nil, placeholder ='', klass ='', options = {})
    merge_class! options, 'text-input-wrap '+ klass
    content_tag(:div, nil, options) do
      concat email_field_tag(name, nil,  class: 'text-input '+(klass.blank? ? '' : klass+'-input'), placeholder: placeholder)
    end
  end

  def pass_input(name = nil, placeholder ='', klass ='', options = {})
    merge_class! options, 'text-input-wrap '+ klass
    content_tag(:div, nil, options) do
      concat password_field_tag(name, nil,  class: 'text-input '+(klass.blank? ? '' : klass+'-input'), placeholder: placeholder)
    end
  end

  def text_area(name = nil, placeholder ='', klass ='', options = {})
    merge_class! options, 'text-input-wrap '+ klass
    content_tag(:div, nil, options) do
      concat text_area_tag(name, nil,  class: 'text-input '+(klass.blank? ? '' : klass+'-input'), placeholder: placeholder)
    end
  end

  def select_wrap(options={}, &block)
    merge_class! options, "select-field pi"
    merge_data! options, {:component => "select_input"}
    content_tag(:div, nil, options) do
      concat content_tag(:div, nil, class: 'selected-placeholder')
      concat capture(&block)
    end
  end


  def check_box(name = nil, val = nil, label = '', options = {})
    merge_class! options,'checkbox-wrap pi'
    merge_data!(options,{:component => 'check_box'})
    content_tag(:div, nil, options) do
      concat hidden_field_tag(name, val, class: 'checkbox-input')
      concat check_box_label(label, name)
    end
  end

  def check_box_label(label, name = nil, options = {}) 
    merge_class! options,'checkbox-wrap'
    label_tag(name, nil, class: 'cb-label') do
      concat fa_icon('square-o')
      concat fa_icon('check-square-o')
      concat label
    end
  end


  def time_select(object_name, method, time = Time.current)
    contents = ''
    contents << select_wrap do
      select_hour(time, {:field_name => "#{method}_hour", :prefix => object_name}, class: 'select-input')
    end
    contents << select_wrap do
      select_minute(time, {:field_name => "#{method}_minute", :prefix => object_name, :minute_step => 5}, class: 'select-input')
    end
    content_tag(:div, contents.html_safe)
  end


  def date_select(object_name, method, date = Date.today)
    contents = ''
    contents << select_wrap do
      select_day(date, {:field_name => "#{method}_day", :prefix => object_name}, class: 'select-input')
    end
    contents << select_wrap do
      select_month(date, {:field_name => "#{method}_month", :prefix => object_name}, class: 'select-input')
    end
    contents << select_wrap do
      select_year(date, {:field_name => "#{method}_year", :prefix => object_name, :start_year => date.year, :end_year => date.year+1}, class: 'select-input')
    end
    content_tag(:div, contents.html_safe)
  end

  def sort_button(tag,label,options = {})
    merge_class! options,'sort-button pi'
    merge_data!(options,{:component => 'sort_button'})
    content_tag(tag, nil, options) do 
        concat label
        concat fa_icon('sort-desc')
        concat fa_icon('sort-asc')
    end
  end

  def avatar_tag(user, style = :thumb)
    if user.avatar.blank?
      content_tag(:div, "#{user.name.first.capitalize}", class: 'avatar-letter')
    else
      image_tag user.avatar.url(style), class: 'avatar-img', title: user.name, alt: user.name
    end
  end

  def log_level
    javascript_tag("pi.log_level = 'debug';") if not Rails.env.production?
  end

  protected
    def merge_class!(options,klass)
      options[:class] = (options[:class] ? "#{options[:class]} " : '') << klass
    end

    def merge_data!(options,data)
      options[:data] = (options[:data] ? options[:data] : {}).merge(data)
    end

end