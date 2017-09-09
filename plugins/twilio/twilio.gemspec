$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "twilio/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "twilio"
  s.version     = Twilio::VERSION
  s.authors     = ["Irem Gokce Yildirim"]
  s.email       = ["iremgokceyildirim@gmail.com"]
  s.homepage    = "TODO"
  s.summary     = "TODO: Summary of Twilio."
  s.description = "TODO: Description of Twilio."
  s.license     = "MIT"

  s.files = Dir["{app,config,db,lib}/**/*", "MIT-LICENSE", "Rakefile", "README.rdoc"]
  s.test_files = Dir["test/**/*"]

  s.add_dependency "rails", "~> 4.2.9"

  s.add_development_dependency "sqlite3"
end
