# -*- encoding: utf-8 -*-
# stub: twilio-ruby 4.9.0 ruby lib

Gem::Specification.new do |s|
  s.name = "twilio-ruby".freeze
  s.version = "4.9.0"

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze]
  s.authors = ["Andrew Benton".freeze]
  s.date = "2015-12-17"
  s.description = "A simple library for communicating with the Twilio REST API, building TwiML, and generating Twilio Client Capability Tokens".freeze
  s.email = ["andrew@twilio.com".freeze]
  s.extra_rdoc_files = ["README.md".freeze, "LICENSE.md".freeze]
  s.files = ["LICENSE.md".freeze, "README.md".freeze]
  s.homepage = "http://github.com/twilio/twilio-ruby".freeze
  s.licenses = ["MIT".freeze]
  s.rdoc_options = ["--line-numbers".freeze, "--inline-source".freeze, "--title".freeze, "twilio-ruby".freeze, "--main".freeze, "README.md".freeze]
  s.required_ruby_version = Gem::Requirement.new(">= 1.9.3".freeze)
  s.rubygems_version = "2.6.10".freeze
  s.summary = "A simple library for communicating with the Twilio REST API, building TwiML, and generating Twilio Client Capability Tokens".freeze

  s.installed_by_version = "2.6.10" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_runtime_dependency(%q<multi_json>.freeze, [">= 1.3.0"])
      s.add_runtime_dependency(%q<builder>.freeze, [">= 2.1.2"])
      s.add_runtime_dependency(%q<jwt>.freeze, ["~> 1.0"])
      s.add_development_dependency(%q<bundler>.freeze, ["~> 1.5"])
    else
      s.add_dependency(%q<multi_json>.freeze, [">= 1.3.0"])
      s.add_dependency(%q<builder>.freeze, [">= 2.1.2"])
      s.add_dependency(%q<jwt>.freeze, ["~> 1.0"])
      s.add_dependency(%q<bundler>.freeze, ["~> 1.5"])
    end
  else
    s.add_dependency(%q<multi_json>.freeze, [">= 1.3.0"])
    s.add_dependency(%q<builder>.freeze, [">= 2.1.2"])
    s.add_dependency(%q<jwt>.freeze, ["~> 1.0"])
    s.add_dependency(%q<bundler>.freeze, ["~> 1.5"])
  end
end
