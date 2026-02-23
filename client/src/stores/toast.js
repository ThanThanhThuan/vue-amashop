import { reactive } from 'vue';

const state = reactive({
  toasts: []
});

let toastId = 0;

export const toastStore = {
  state,
  
  success(message) {
    this.addToast(message, 'success');
  },
  
  error(message) {
    this.addToast(message, 'error');
  },
  
  info(message) {
    this.addToast(message, 'info');
  },
  
  addToast(message, type = 'info') {
    const id = ++toastId;
    state.toasts.push({ id, message, type });
    
    setTimeout(() => {
      this.removeToast(id);
    }, 3000);
  },
  
  removeToast(id) {
    const index = state.toasts.findIndex(t => t.id === id);
    if (index > -1) {
      state.toasts.splice(index, 1);
    }
  }
};
