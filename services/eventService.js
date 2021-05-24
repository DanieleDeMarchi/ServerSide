import eventModel from '../models/Event';

export default class eventService{
    
    async findAll() {
        const eventi = await Event.find()    
        return eventi        
    }
    
    async findById(id) {   
        try {
            const evento = await Event.findOne({ _id })    
            if (!evento) {
                return null
            }
            return evento
        } catch (e) {
            throw new Error('DB_ERROR');
        }
    }
    
    async eventsSearchByTitle(queryString){
        
    }

    async eventsAdvanceSearch(queryParameters){
        
    }

    async deleteEvent(eventId){
        
    }

    async createEvent(eventDTO){
        
    }
    
    
}