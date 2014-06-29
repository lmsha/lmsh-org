class EnumValue

   attr_reader :key, :value

   @enums = {}

   def initialize(key = nil)
	   init_by_key(key) if key 
   end

   def key=(new_key)
      init_by_key new_key   
   end

   def value=(new_value)
      init_by_key(self.class.enums.key(new_value)) if self.class.enums.key(new_value)
   end

   def self.value(key)
      if @enums.key?(key)
        @enums[key]
      end 
   end

   def self.enums
    @enums
   end

   def method_missing(name, *args, &block)
      if name =~ /^(.*?)((\?|!)?)$/
        if self.class.enums.key?($1.to_sym)
          case $2
            when '?'
               key == $1.to_sym
            when '!'
               self.key = $1.to_sym
            end
         end
      end
    end

   protected

      def init_by_key(key)
         unless self.class.enums.key?(key)
            raise ArgumentError, "Undefined key!"
         end

         @key = key
         @value = self.class.enums[key] 
      end
end