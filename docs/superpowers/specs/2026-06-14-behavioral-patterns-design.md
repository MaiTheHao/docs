# Design Specification: Behavioral Patterns Documentation

This specification details the structure, layout, and content for the Behavioral Patterns documentation to be added to the project.

## 1. Goal

Add high-quality, professional, and visually appealing documentation for 7 core Behavioral Design Patterns (Observer, Strategy, Command, State, Template Method, Mediator, Chain of Responsibility) under `architecture/design_patterns/behavioral/`.

---

## 2. Directory Structure

A new subdirectory `behavioral` will be created under `architecture/design_patterns/` with the following files:
* `behavioral/README.md` - Main index and overview for Behavioral Patterns.
* `behavioral/observer.md` - Observer pattern details.
* `behavioral/strategy.md` - Strategy pattern details.
* `behavioral/command.md` - Command pattern details.
* `behavioral/state.md` - State pattern details.
* `behavioral/template_method.md` - Template Method pattern details.
* `behavioral/mediator.md` - Mediator pattern details.
* `behavioral/chain_of_responsibility.md` - Chain of Responsibility pattern details.

The main table of contents in `architecture/design_patterns/README.md` will be updated to include the behavioral patterns.

---

## 3. Detailed File Contents and Design

### 3.1. Main Index (`behavioral/README.md`)
This file will introduce behavioral patterns and list all 7 patterns, including:
* Definition & Purpose (Định nghĩa & Mục đích)
* Characteristics/Applications (Đặc điểm và ứng dụng)
* Link to the detailed document

### 3.2. Detailed Pattern Files
Each pattern file will follow the approved template structure with the following content:

#### 1. Observer (`behavioral/observer.md`)
* **UML Class Diagram (Mermaid):**
  ```mermaid
  classDiagram
      class Subject {
          <<interface>>
          +attach(Observer o)*
          +detach(Observer o)*
          +notifyObservers()*
      }
      class WeatherStation {
          -List~Observer~ observers
          -float temperature
          +setTemperature(float temp)
          +attach(Observer o)
          +detach(Observer o)
          +notifyObservers()
      }
      class Observer {
          <<interface>>
          +update(float temperature)*
      }
      class PhoneDisplay {
          +update(float temperature)
      }
      
      Subject <|.. WeatherStation : implements
      Observer <|.. PhoneDisplay : implements
      Subject o--> Observer : aggregation (observers)
  ```
* **Java Sample Code:** Standard Java example provided in the request (`WeatherStation`, `PhoneDisplay`, etc.).

#### 2. Strategy (`behavioral/strategy.md`)
* **UML Class Diagram (Mermaid):**
  ```mermaid
  classDiagram
      class PaymentStrategy {
          <<interface>>
          +pay(int amount)*
      }
      class CreditCardPayment {
          +pay(int amount)
      }
      class PayPalPayment {
          +pay(int amount)
      }
      class ShoppingCart {
          -PaymentStrategy paymentStrategy
          +setPaymentStrategy(PaymentStrategy paymentStrategy)
          +checkout(int amount)
      }

      PaymentStrategy <|.. CreditCardPayment : implements
      PaymentStrategy <|.. PayPalPayment : implements
      ShoppingCart o--> PaymentStrategy : uses
  ```
* **Java Sample Code:** `ShoppingCart` delegating payment to the dynamic `PaymentStrategy` implementation.

#### 3. Command (`behavioral/command.md`)
* **UML Class Diagram (Mermaid):**
  ```mermaid
  classDiagram
      class Command {
          <<interface>>
          +execute()*
          +undo()*
      }
      class LightOnCommand {
          -Light light
          +execute()
          +undo()
      }
      class Light {
          +turnOn()
          +turnOff()
      }
      class RemoteControl {
          -Command command
          +setCommand(Command command)
          +pressButton()
          +pressUndo()
      }

      Command <|.. LightOnCommand : implements
      LightOnCommand --> Light : receiver
      RemoteControl o--> Command : aggregates
  ```
* **Java Sample Code:** `RemoteControl` triggering `LightOnCommand` to operate on `Light`.

#### 4. State (`behavioral/state.md`)
* **UML Class Diagram (Mermaid):**
  ```mermaid
  classDiagram
      class DocumentState {
          <<interface>>
          +publish()*
      }
      class DraftState {
          +publish()
      }
      class PublishedState {
          +publish()
      }
      class Document {
          -DocumentState state
          +setState(DocumentState state)
          +publish()
      }

      DocumentState <|.. DraftState : implements
      DocumentState <|.. PublishedState : implements
      Document o--> DocumentState : state reference
  ```
* **Java Sample Code:** `Document` changing behavior dynamically depending on whether it is in `DraftState` or `PublishedState`.

#### 5. Template Method (`behavioral/template_method.md`)
* **UML Class Diagram (Mermaid):**
  ```mermaid
  classDiagram
      class DataProcessor {
          <<abstract>>
          +process() void
          #readData()* void
          #processData()* void
          -saveData() void
      }
      class CsvDataProcessor {
          #readData()
          #processData()
      }

      DataProcessor <|-- CsvDataProcessor : extends
  ```
* **Java Sample Code:** Abstract class `DataProcessor` defining the template method `process()`, with `CsvDataProcessor` customizing steps.

#### 6. Mediator (`behavioral/mediator.md`)
* **UML Class Diagram (Mermaid):**
  ```mermaid
  classDiagram
      class ChatMediator {
          <<interface>>
          +sendMessage(String msg, User user)*
          +addUser(User user)*
      }
      class ChatRoom {
          -List~User~ users
          +sendMessage(String msg, User user)
          +addUser(User user)
      }
      class User {
          <<abstract>>
          #ChatMediator mediator
          #String name
          +send(String msg)*
          +receive(String msg)*
      }
      class ChatUser {
          +send(String msg)
          +receive(String msg)
      }

      ChatMediator <|.. ChatRoom : implements
      User <|-- ChatUser : extends
      ChatRoom o--> User : manages
      User --> ChatMediator : references
  ```
* **Java Sample Code:** `ChatUser` components interacting indirectly through `ChatRoom` mediator.

#### 7. Chain of Responsibility (`behavioral/chain_of_responsibility.md`)
* **UML Class Diagram (Mermaid):**
  ```mermaid
  classDiagram
      class Logger {
          <<abstract>>
          #int level
          #Logger nextLogger
          +setNextLogger(Logger nextLogger)
          +logMessage(int level, String message)
          #write(String message)* void
      }
      class ConsoleLogger {
          #write(String message)
      }
      class ErrorLogger {
          #write(String message)
      }

      Logger <|-- ConsoleLogger : extends
      Logger <|-- ErrorLogger : extends
      Logger --> Logger : next handler
  ```
* **Java Sample Code:** Logging chain where `ErrorLogger` forwards non-error logs down the chain to `ConsoleLogger`.

---

## 4. Verification Plan

* **Visual Check:** Confirm that all markdown files render properly in VS Code preview / markdown renderer.
* **Mermaid Check:** Verify that there are no syntax errors in the Mermaid diagrams.
* **Link Consistency Check:** Verify that the relative table-of-contents links inside the files, in the `behavioral/README.md` index, and in the main `design_patterns/README.md` index work correctly.
