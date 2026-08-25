import { Component, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotService } from '../services/chatbot.service';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrl: './chatbot.scss',
  template: `
    <!-- Floating Chatbot FAB -->
    <button class="chatbot-fab" (click)="toggleChat(); $event.stopPropagation();" title="Ask HR Assistant">
      <i class="bi" [ngClass]="isChatOpen() ? 'bi-x-lg' : 'bi-chat-dots-fill'"></i>
    </button>

    <!-- Chatbot Panel -->
    <div class="chatbot-panel" *ngIf="isChatOpen()" (click)="$event.stopPropagation()">
      <div class="chat-header">
        <div class="d-flex align-items-center">
          <i class="bi bi-robot text-primary fs-5 me-2"></i>
          <span class="chat-title">HR Assist Bot</span>
          <small class="ms-2 badge bg-secondary fw-normal font-monospace" style="font-size: 0.7rem;">ID: {{ sessionId() || 'null' }}</small>
        </div>
        <button class="btn btn-link text-white p-0 border-0 shadow-none" (click)="toggleChat()">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
      
      <div class="chat-body" #chatBody>
        <div *ngFor="let msg of chatMessages()" class="msg-bubble" [ngClass]="msg.sender">
          {{ msg.text }}
        </div>
      </div>
      
      <div class="chat-footer">
        <form (ngSubmit)="sendChatMessage()">
          <div class="input-group">
            <input type="text" name="chatInput" class="form-control" placeholder="Ask a question..." [(ngModel)]="chatInput" autocomplete="off" required>
            <button type="submit" class="btn btn-primary btn-sm">
              <i class="bi bi-send-fill"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class ChatbotComponent {
  isChatOpen = signal(false);
  sessionId = signal<string | null>(null);
  chatInput = '';
  chatMessages = signal<ChatMessage[]>([
    { sender: 'bot', text: 'Hello! I am your HR Assist Bot. Ask me any question about our company policies, leaves, payroll, or benefits.' }
  ]);

  @ViewChild('chatBody') private chatBody!: ElementRef;

  constructor(private chatbotService: ChatbotService) { }

  private scrollToBottom() {
    setTimeout(() => {
      if (this.chatBody) {
        this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight;
      }
    }, 50);
  }

  toggleChat() {
    this.isChatOpen.update(val => {
      const nextVal = !val;
      if (!nextVal) {
        // Reset session_id to null when user closes chatbot
        this.sessionId.set(null);
      } else {
        // When user opens chatbot, session_id is initially null
        this.sessionId.set(null);
      }
      return nextVal;
    });
  }

  sendChatMessage() {
    const messageText = this.chatInput.trim();
    if (!messageText) return;

    // Add user message
    this.chatMessages.update(msgs => [...msgs, { sender: 'user', text: messageText }]);
    this.chatInput = '';

    // Show temporary typing status
    this.chatMessages.update(msgs => [...msgs, { sender: 'bot', text: 'Thinking...' }]);
    this.scrollToBottom();

    // Make HTTP call sending current session_id (null on initial ask)
    this.chatbotService.askQuestion(messageText, this.sessionId()).subscribe({
      next: (response) => {
        // Save session_id received from API response
        const newSessionId = response.session_id || response.data?.session_id;
        if (newSessionId) {
          this.sessionId.set(newSessionId);
        }

        this.chatMessages.update(msgs => {
          const list = [...msgs];
          if (list.length > 0 && list[list.length - 1].text === 'Thinking...') {
            list.pop();
          }
          const answerText = (response.data && response.data.answer)
            ? response.data.answer
            : (response.answer || 'Sorry, I did not catch that.');
          return [...list, { sender: 'bot', text: answerText }];
        });
        this.scrollToBottom();
      },
      error: (err) => {
        console.error('Chatbot API error:', err);
        setTimeout(() => {
          let reply = "We're unable to retrieve the requested HR information right now. Please try again after a short while. If this problem persists, please contact the HR Helpdesk.";

          this.chatMessages.update(msgs => {
            const list = [...msgs];
            if (list.length > 0 && list[list.length - 1].text === 'Thinking...') {
              list.pop();
            }
            return [...list, { sender: 'bot', text: reply }];
          });
          this.scrollToBottom();
        }, 500);
      }
    });
  }
}
