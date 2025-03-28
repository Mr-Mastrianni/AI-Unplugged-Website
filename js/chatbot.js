document.addEventListener('DOMContentLoaded',function(){createChatbotUI();initChatbot();});function createChatbotUI(){const chatbotContainer=document.createElement('div');chatbotContainer.id='chatbot-container';chatbotContainer.classList.add('chatbot-collapsed');chatbotContainer.setAttribute('aria-live','polite');chatbotContainer.setAttribute('role','dialog');chatbotContainer.setAttribute('aria-labelledby','chatbot-header');const chatbotButton=document.createElement('button');chatbotButton.id='chatbot-button';chatbotButton.innerHTML='<i class="fas fa-comment-dots"></i>';chatbotButton.setAttribute('aria-label','Open chat assistant');chatbotButton.setAttribute('aria-expanded','false');const chatbotContent=document.createElement('div');chatbotContent.id='chatbot-content';const chatbotHeader=document.createElement('div');chatbotHeader.id='chatbot-header';chatbotHeader.innerHTML=`<h3 id="chatbot-title">AI Assistant</h3><button id="chatbot-minimize"aria-label="Minimize chat"><i class="fas fa-minus"></i></button>`;const chatbotMessages=document.createElement('div');chatbotMessages.id='chatbot-messages';chatbotMessages.setAttribute('aria-live','polite');const chatbotInput=document.createElement('div');chatbotInput.id='chatbot-input';chatbotInput.innerHTML=`<input type="text"id="chatbot-message"placeholder="Type your question..."aria-label="Type your message"><button id="chatbot-send"aria-label="Send message"><i class="fas fa-paper-plane"></i></button>`;chatbotContent.appendChild(chatbotHeader);chatbotContent.appendChild(chatbotMessages);chatbotContent.appendChild(chatbotInput);chatbotContainer.appendChild(chatbotButton);chatbotContainer.appendChild(chatbotContent);document.body.appendChild(chatbotContainer);addChatbotStyles();}
function addChatbotStyles(){const style=document.createElement('style');style.textContent=`#chatbot-container{position:fixed;bottom:20px;right:20px;z-index:1000;font-family:'Montserrat',sans-serif;transition:all 0.3s ease;}#chatbot-button{width:60px;height:60px;border-radius:50%;background-color:var(--primary-color,#4285f4);color:white;border:none;box-shadow:0 2px 10px rgba(0,0,0,0.2);cursor:pointer;font-size:24px;display:flex;align-items:center;justify-content:center;transition:transform 0.3s ease;}#chatbot-button:hover{transform:scale(1.05);}#chatbot-content{position:absolute;bottom:70px;right:0;width:350px;height:450px;background-color:white;border-radius:10px;box-shadow:0 5px 25px rgba(0,0,0,0.1);display:flex;flex-direction:column;overflow:hidden;transition:all 0.3s ease;opacity:0;transform:translateY(20px);pointer-events:none;}.chatbot-expanded#chatbot-content{opacity:1;transform:translateY(0);pointer-events:auto;}#chatbot-header{background-color:var(--primary-color,#4285f4);color:white;padding:15px;display:flex;justify-content:space-between;align-items:center;}#chatbot-title{margin:0;font-size:16px;}#chatbot-minimize{background:none;border:none;color:white;cursor:pointer;font-size:16px;}#chatbot-messages{flex:1;padding:15px;overflow-y:auto;display:flex;flex-direction:column;gap:10px;}.chat-message{max-width:80%;padding:10px 15px;border-radius:18px;margin-bottom:5px;font-size:14px;line-height:1.4;}.bot-message{background-color:#f0f0f0;align-self:flex-start;border-bottom-left-radius:5px;}.user-message{background-color:var(--primary-color,#4285f4);color:white;align-self:flex-end;border-bottom-right-radius:5px;}#chatbot-input{display:flex;padding:10px 15px;border-top:1px solid#eee;}#chatbot-message{flex:1;padding:10px;border:1px solid#ddd;border-radius:20px;font-size:14px;outline:none;}#chatbot-send{background:none;border:none;color:var(--primary-color,#4285f4);font-size:18px;cursor:pointer;margin-left:10px;}.typing-indicator{display:flex;padding:10px 15px;background-color:#f0f0f0;border-radius:18px;align-self:flex-start;width:fit-content;}.typing-dot{width:8px;height:8px;background-color:#777;border-radius:50%;margin:0 2px;animation:typing-animation 1.4s infinite ease-in-out;}.typing-dot:nth-child(1){animation-delay:0s;}.typing-dot:nth-child(2){animation-delay:0.2s;}.typing-dot:nth-child(3){animation-delay:0.4s;}@keyframes typing-animation{0%,60%,100%{transform:translateY(0);}
30%{transform:translateY(-5px);}}
body.dark-mode#chatbot-content{background-color:#2a2a2a;color:#e0e0e0;}
body.dark-mode#chatbot-message{background-color:#3a3a3a;color:#e0e0e0;border-color:#444;}
body.dark-mode.bot-message{background-color:#3a3a3a;}
body.dark-mode.typing-indicator{background-color:#3a3a3a;}
body.dark-mode.typing-dot{background-color:#aaa;}.suggestion-buttons button{transition:all 0.2s ease;}.suggestion-buttons button:hover{transform:translateY(-2px);box-shadow:0 2px 5px rgba(0,0,0,0.1);}
.calendar-container{background-color:white;border-radius:8px;padding:10px;margin-top:10px;box-shadow:0 2px 10px rgba(0,0,0,0.1);}.calendar-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;}.calendar-nav{display:flex;gap:5px;}.calendar-nav button{background:none;border:none;cursor:pointer;font-size:14px;color:var(--primary-color,#4285f4);}.calendar-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:2px;text-align:center;font-size:12px;}.calendar-day{padding:5px;cursor:pointer;border-radius:4px;}.calendar-day:hover:not(.disabled){background-color:#f0f0f0;}.calendar-day.selected{background-color:var(--primary-color,#4285f4);color:white;}.calendar-day.disabled{color:#ccc;cursor:not-allowed;}.timeslots{display:grid;grid-template-columns:repeat(2,1fr);gap:5px;margin-top:10px;}.timeslot{padding:5px;text-align:center;border-radius:4px;border:1px solid#eee;cursor:pointer;font-size:12px;}.timeslot:hover:not(.disabled){background-color:#f0f0f0;}.timeslot.selected{background-color:var(--primary-color,#4285f4);color:white;}.timeslot.disabled{color:#ccc;cursor:not-allowed;}.schedule-actions{display:flex;justify-content:space-between;margin-top:10px;}.schedule-actions button{padding:5px 10px;border-radius:4px;border:none;cursor:pointer;font-size:12px;}.confirm-button{background-color:var(--primary-color,#4285f4);color:white;}.cancel-button{background-color:#f0f0f0;}
body.dark-mode.calendar-container{background-color:#2a2a2a;color:#e0e0e0;}
body.dark-mode.calendar-day:hover:not(.disabled){background-color:#3a3a3a;}
body.dark-mode.timeslot{border-color:#444;}
body.dark-mode.timeslot:hover:not(.disabled){background-color:#3a3a3a;}
body.dark-mode.cancel-button{background-color:#3a3a3a;color:#e0e0e0;}
.contact-form{margin-top:10px;}.form-field{margin-bottom:10px;}.form-field label{display:block;margin-bottom:3px;font-size:12px;}.form-field input{width:100%;padding:8px 10px;border:1px solid#ddd;border-radius:4px;font-size:12px;}
body.dark-mode.form-field input{background-color:#3a3a3a;color:#e0e0e0;border-color:#444;}`;document.head.appendChild(style);}
function initChatbot(){const chatbotContainer=document.getElementById('chatbot-container');const chatbotButton=document.getElementById('chatbot-button');const chatbotMinimize=document.getElementById('chatbot-minimize');const chatbotMessages=document.getElementById('chatbot-messages');const chatbotInput=document.getElementById('chatbot-message');const chatbotSend=document.getElementById('chatbot-send');setTimeout(()=>{addBotMessage("Hello! I'm your AI assistant. How can I help you today?");addSuggestionButtons();},500);chatbotButton.addEventListener('click',function(){chatbotContainer.classList.remove('chatbot-collapsed');chatbotContainer.classList.add('chatbot-expanded');chatbotButton.setAttribute('aria-expanded','true');chatbotInput.focus();if(chatbotMessages.scrollHeight>0){chatbotMessages.scrollTop=chatbotMessages.scrollHeight;}});chatbotMinimize.addEventListener('click',function(){chatbotContainer.classList.remove('chatbot-expanded');chatbotContainer.classList.add('chatbot-collapsed');chatbotButton.setAttribute('aria-expanded','false');});chatbotInput.addEventListener('keypress',function(e){if(e.key==='Enter'){sendMessage();}});chatbotSend.addEventListener('click',sendMessage);let isSchedulingDemo=false;let selectedDate=null;let selectedTime=null;let userInfo={name:'',email:'',phone:''};function sendMessage(){const message=chatbotInput.value.trim();if(message){addUserMessage(message);chatbotInput.value='';showTypingIndicator();setTimeout(()=>{hideTypingIndicator();const response=generateResponse(message);addBotMessage(response);chatbotMessages.scrollTop=chatbotMessages.scrollHeight;},1000+Math.random()*1000);}}
function addUserMessage(message){const messageElement=document.createElement('div');messageElement.classList.add('chat-message','user-message');messageElement.textContent=message;chatbotMessages.appendChild(messageElement);chatbotMessages.scrollTop=chatbotMessages.scrollHeight;}
function addBotMessage(message){const messageElement=document.createElement('div');messageElement.classList.add('chat-message','bot-message');messageElement.textContent=message;chatbotMessages.appendChild(messageElement);chatbotMessages.scrollTop=chatbotMessages.scrollHeight;}
function showTypingIndicator(){const typingIndicator=document.createElement('div');typingIndicator.classList.add('typing-indicator');typingIndicator.id='typing-indicator';typingIndicator.setAttribute('aria-label','AI assistant is typing');for(let i=0;i<3;i++){const dot=document.createElement('div');dot.classList.add('typing-dot');typingIndicator.appendChild(dot);}
chatbotMessages.appendChild(typingIndicator);chatbotMessages.scrollTop=chatbotMessages.scrollHeight;}
function hideTypingIndicator(){const typingIndicator=document.getElementById('typing-indicator');if(typingIndicator){typingIndicator.remove();}}
function addSuggestionButtons(){const suggestions=["What AI solutions do you offer?","Schedule a demo","Implementation process","Pricing information"];const buttonsContainer=document.createElement('div');buttonsContainer.classList.add('suggestion-buttons');buttonsContainer.style.display='flex';buttonsContainer.style.flexWrap='wrap';buttonsContainer.style.gap='5px';buttonsContainer.style.marginTop='10px';suggestions.forEach(suggestion=>{const button=document.createElement('button');button.textContent=suggestion;button.style.fontSize='12px';button.style.padding='8px 12px';button.style.backgroundColor='#f0f0f0';button.style.border='none';button.style.borderRadius='15px';button.style.cursor='pointer';button.style.marginBottom='5px';button.setAttribute('aria-label',`Ask:${suggestion}`);button.addEventListener('click',function(){addUserMessage(suggestion);showTypingIndicator();setTimeout(()=>{hideTypingIndicator();const response=generateResponse(suggestion);addBotMessage(response);if(suggestion.toLowerCase().includes('schedule')||suggestion.toLowerCase().includes('demo')){showScheduleCalendar();}
chatbotMessages.scrollTop=chatbotMessages.scrollHeight;},1000+Math.random()*1000);});if(document.body.classList.contains('dark-mode')){button.style.backgroundColor='#3a3a3a';button.style.color='#e0e0e0';}
buttonsContainer.appendChild(button);});chatbotMessages.appendChild(buttonsContainer);}
function showScheduleCalendar(){isSchedulingDemo=true;const calendarContainer=document.createElement('div');calendarContainer.classList.add('calendar-container');calendarContainer.id='schedule-calendar';const today=new Date();const currentMonth=today.getMonth();const currentYear=today.getFullYear();const calendarHeader=document.createElement('div');calendarHeader.classList.add('calendar-header');const monthYearLabel=document.createElement('div');monthYearLabel.classList.add('month-year');monthYearLabel.textContent=`${getMonthName(currentMonth)}${currentYear}`;const calendarNav=document.createElement('div');calendarNav.classList.add('calendar-nav');const prevButton=document.createElement('button');prevButton.innerHTML='<i class="fas fa-chevron-left"></i>';prevButton.setAttribute('aria-label','Previous month');const nextButton=document.createElement('button');nextButton.innerHTML='<i class="fas fa-chevron-right"></i>';nextButton.setAttribute('aria-label','Next month');calendarNav.appendChild(prevButton);calendarNav.appendChild(nextButton);calendarHeader.appendChild(monthYearLabel);calendarHeader.appendChild(calendarNav);const calendarGrid=document.createElement('div');calendarGrid.classList.add('calendar-grid');const dayLabels=['Su','Mo','Tu','We','Th','Fr','Sa'];dayLabels.forEach(day=>{const dayLabel=document.createElement('div');dayLabel.classList.add('day-label');dayLabel.textContent=day;calendarGrid.appendChild(dayLabel);});const firstDay=new Date(currentYear,currentMonth,1).getDay();const daysInMonth=new Date(currentYear,currentMonth+1,0).getDate();for(let i=0;i<firstDay;i++){const emptyDay=document.createElement('div');emptyDay.classList.add('calendar-day','disabled');calendarGrid.appendChild(emptyDay);}
for(let i=1;i<=daysInMonth;i++){const dayCell=document.createElement('div');dayCell.classList.add('calendar-day');dayCell.textContent=i;if(currentMonth===today.getMonth()&&i<today.getDate()){dayCell.classList.add('disabled');}else{const dayOfWeek=new Date(currentYear,currentMonth,i).getDay();if(dayOfWeek===0||dayOfWeek===6){dayCell.classList.add('disabled');}else{dayCell.addEventListener('click',()=>{document.querySelectorAll('.calendar-day.selected').forEach(day=>{day.classList.remove('selected');});dayCell.classList.add('selected');selectedDate=new Date(currentYear,currentMonth,i);showTimeSlots();});}}
calendarGrid.appendChild(dayCell);}
calendarContainer.appendChild(calendarHeader);calendarContainer.appendChild(calendarGrid);const instructions=document.createElement('div');instructions.style.fontSize='12px';instructions.style.margin='10px 0 5px';instructions.textContent='Select a date to view available times';calendarContainer.appendChild(instructions);chatbotMessages.appendChild(calendarContainer);chatbotMessages.scrollTop=chatbotMessages.scrollHeight;prevButton.addEventListener('click',()=>{});nextButton.addEventListener('click',()=>{});}
function showTimeSlots(){const existingTimeSlots=document.querySelector('.timeslots');if(existingTimeSlots){existingTimeSlots.remove();}
const timeSlotsContainer=document.createElement('div');timeSlotsContainer.classList.add('timeslots');const timeSlots=['9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM'];timeSlots.forEach(time=>{const timeSlot=document.createElement('div');timeSlot.classList.add('timeslot');timeSlot.textContent=time;if(Math.random()<0.3){timeSlot.classList.add('disabled');}else{timeSlot.addEventListener('click',()=>{document.querySelectorAll('.timeslot.selected').forEach(slot=>{slot.classList.remove('selected');});timeSlot.classList.add('selected');selectedTime=time;showScheduleActions();});}
timeSlotsContainer.appendChild(timeSlot);});const calendar=document.getElementById('schedule-calendar');calendar.appendChild(timeSlotsContainer);chatbotMessages.scrollTop=chatbotMessages.scrollHeight;}
function showScheduleActions(){const existingActions=document.querySelector('.schedule-actions');if(existingActions){existingActions.remove();}
const actionsContainer=document.createElement('div');actionsContainer.classList.add('schedule-actions');const confirmButton=document.createElement('button');confirmButton.classList.add('confirm-button');confirmButton.textContent='Confirm Time';confirmButton.addEventListener('click',showContactForm);const cancelButton=document.createElement('button');cancelButton.classList.add('cancel-button');cancelButton.textContent='Cancel';cancelButton.addEventListener('click',()=>{const calendar=document.getElementById('schedule-calendar');if(calendar){calendar.remove();}
isSchedulingDemo=false;selectedDate=null;selectedTime=null;addBotMessage("No problem. Feel free to ask if you have any other questions or would like to schedule a demo later.");});actionsContainer.appendChild(cancelButton);actionsContainer.appendChild(confirmButton);const calendar=document.getElementById('schedule-calendar');calendar.appendChild(actionsContainer);chatbotMessages.scrollTop=chatbotMessages.scrollHeight;}
function showContactForm(){const calendar=document.getElementById('schedule-calendar');if(calendar){calendar.remove();}
const formContainer=document.createElement('div');formContainer.classList.add('contact-form');formContainer.id='contact-form';const nameField=createFormField('name','Name','text','Enter your name');const emailField=createFormField('email','Email','email','Enter your email');const phoneField=createFormField('phone','Phone (optional)','tel','Enter your phone number');const actionsContainer=document.createElement('div');actionsContainer.classList.add('schedule-actions');const confirmButton=document.createElement('button');confirmButton.classList.add('confirm-button');confirmButton.textContent='Schedule Demo';confirmButton.addEventListener('click',submitScheduleRequest);const cancelButton=document.createElement('button');cancelButton.classList.add('cancel-button');cancelButton.textContent='Cancel';cancelButton.addEventListener('click',()=>{const form=document.getElementById('contact-form');if(form){form.remove();}
isSchedulingDemo=false;selectedDate=null;selectedTime=null;addBotMessage("No problem. Feel free to ask if you have any other questions or would like to schedule a demo later.");});actionsContainer.appendChild(cancelButton);actionsContainer.appendChild(confirmButton);formContainer.appendChild(nameField);formContainer.appendChild(emailField);formContainer.appendChild(phoneField);formContainer.appendChild(actionsContainer);chatbotMessages.appendChild(formContainer);chatbotMessages.scrollTop=chatbotMessages.scrollHeight;setTimeout(()=>{document.getElementById('name').focus();},100);}
function createFormField(id,label,type,placeholder){const fieldContainer=document.createElement('div');fieldContainer.classList.add('form-field');const fieldLabel=document.createElement('label');fieldLabel.setAttribute('for',id);fieldLabel.textContent=label;const fieldInput=document.createElement('input');fieldInput.id=id;fieldInput.type=type;fieldInput.placeholder=placeholder;fieldContainer.appendChild(fieldLabel);fieldContainer.appendChild(fieldInput);return fieldContainer;}
function submitScheduleRequest(){const name=document.getElementById('name').value.trim();const email=document.getElementById('email').value.trim();const phone=document.getElementById('phone').value.trim();if(!name){addBotMessage("Please enter your name.");return;}
if(!email||!isValidEmail(email)){addBotMessage("Please enter a valid email address.");return;}
userInfo.name=name;userInfo.email=email;userInfo.phone=phone;const form=document.getElementById('contact-form');if(form){form.remove();}
const dateOptions={weekday:'long',month:'long',day:'numeric',year:'numeric'};const formattedDate=selectedDate.toLocaleDateString('en-US',dateOptions);addBotMessage(`Great!I've scheduled your demo for ${formattedDate} at ${selectedTime}.`);
        
        // Add follow-up message
        setTimeout(() => {
            addBotMessage(`We've sent a confirmation email to ${email}.A member of our team will connect with you at the scheduled time.You'll receive a calendar invite and meeting link shortly.`);
        }, 1000);
        
        // Reset scheduling state
        isSchedulingDemo = false;
        selectedDate = null;
        selectedTime = null;
        
        // In a real implementation, we would send this data to a server to handle the scheduling
        // For now, we just log it to the console
        console.log('Demo scheduled:', {
            name,
            email,
            phone,
            date: formattedDate,
            time: selectedTime
        });
    }
    
    // Helper function to get month name
    function getMonthName(month) {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return months[month];
    }
    
    // Helper function to validate email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Generate response based on user message
    function generateResponse(message) {
        message = message.toLowerCase();
        
        // Common responses based on keywords
        if (message.includes('hi') || message.includes('hello') || message.includes('hey')) {
            return "Hello! How can I help you with AI solutions today?";
        }
        
        if (message.includes('what') && message.includes('solution')) {
            return "We offer three main AI solutions: AI Chatbots for 24/7 customer support, Predictive Analytics for data-driven insights, and Business Automation to streamline your operations.";
        }
        
        if (message.includes('chatbot')) {
            return "Our AI Chatbots provide 24/7 customer support, can handle multiple inquiries simultaneously, and learn from interactions. They integrate seamlessly with your website and existing systems.";
        }
        
        if (message.includes('analytic')) {
            return "Our Predictive Analytics solutions help you optimize inventory, forecast sales, and make data-driven decisions. We transform your existing data into actionable insights.";
        }
        
        if (message.includes('automation')) {
            return "Our Business Automation solutions streamline operations by automating repetitive tasks, document processing, and workflow management, freeing your team to focus on growth.";
        }
        
        if (message.includes('cost') || message.includes('price') || message.includes('how much')) {
            return "Our pricing is customized based on your business needs and solution scope. Typically, our solutions start at $499/month. Would you like to schedule a demo for a personalized quote?";
        }
        
        if (message.includes('implementation') || message.includes('process')) {
            return "Our implementation process has 5 steps: Consultation, Solution Design, Implementation, Training, and Ongoing Support. Most solutions can be implemented within 2-4 weeks.";
        }
        
        if (message.includes('schedule') || message.includes('demo') || message.includes('consultation')) {
            return "I'd be happy to help you schedule a demo.Let's find a time that works for you.";
        }
        
        if (message.includes('thank')) {
            return "You're welcome!Is there anything else I can help you with?";
        }
        
        // Default response
        return "That'