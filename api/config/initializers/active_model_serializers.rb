Rails.application.routes.default_url_options[:host] = ENV['ADVOCATE_SYSTEM_API_URL']
ActiveModelSerializers.config.default_includes = '**'
