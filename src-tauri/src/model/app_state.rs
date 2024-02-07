use std::sync::{mpsc::Receiver, Mutex};

use super::event::Events;

pub struct AppState {
    pub tx: Receiver<Events>,
}

pub type AppStateType = Mutex<AppState>;
impl AppState {
    pub fn new(tx: Receiver<Events>) -> AppStateType {
        Mutex::new(AppState { tx })
    }
}
