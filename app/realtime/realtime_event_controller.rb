class RealtimeEventController < FayeRails::Controller
  channel '/event' do
    subscribe do
      Rails.logger.debug "Received on #{channel}: #{inspect}"
    end
  end
end