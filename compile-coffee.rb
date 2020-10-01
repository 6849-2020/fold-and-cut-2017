require 'coffee_script'

ARGV.each do |a|
	print CoffeeScript.compile(File.read(a), {:bare => true})
end
