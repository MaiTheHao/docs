# JavaScript: Prototype vs Closure - Giải thích chi tiết

## Mục lục

1. [Vấn đề gốc](#vấn-đề-gốc)
2. [Phần 1: Hiểu Prototype](#phần-1-hiểu-prototype)
3. [Phần 2: Function và Constructor](#phần-2-function-và-constructor)
4. [Phần 3: Prototype vs Closure - So sánh chi tiết](#phần-3-prototype-vs-closure---so-sánh-chi-tiết)
5. [Phần 4: Vấn đề `this` - Tại sao nó khó?](#phần-4-vấn-đề-this---tại-sao-nó-khó)
6. [Phần 5: Arrow Function và `this`](#phần-5-arrow-function-và-this)
7. [Phần 6: Bản chất thật của JS OOP](#phần-6-bản-chất-thật-của-js-oop)
8. [Phần 7: Bảng so sánh tổng hợp](#phần-7-bảng-so-sánh-tổng-hợp)
9. [Phần 8: Kết luận](#phần-8-kết-luận)
10. [Phần 9: Ví dụ thực tế so sánh](#phần-9-ví-dụ-thực-tế-so-sánh)
11. [Tóm tắt nhanh](#tóm-tắt-nhanh)

---

## Vấn đề gốc

Hầu hết người học JS gặp khó khăn vì học **syntax trước khi hiểu object model**. Điều cần hiểu trước tiên:

> **Lưu ý:** JS không có class thực sự - `class` chỉ là syntax đẹp cho prototype

---

## Phần 1: Hiểu Prototype

### 1.1 Object model thực sự của JS

Mỗi object JS có một **liên kết ẩn** gọi là `[[Prototype]]` trỏ tới object khác.

**Ví dụ cơ bản:**

```javascript
const user = {
    name: "Ojou"
};

// Thực tế object này có cấu trúc:
// user
//   ├── name: "Ojou"
//   └── [[Prototype]] → Object.prototype
//                        ├── toString()
//                        ├── hasOwnProperty()
//                        └── ... (các method khác)
//                          └── [[Prototype]] → null
```

### 1.2 Cách JS tìm kiếm property (Property Lookup)

Khi bạn truy cập property, JS tìm theo thứ tự:

```javascript
// Bước 1: Tìm trực tiếp trên object
console.log(user.name);  
// Kết quả: "Ojou" - tìm được ở chính object

// Bước 2: Nếu không tìm được, tìm trong prototype
console.log(user.toString());  
// Kết quả: "[object Object]"
// toString() không ở user, nhưng ở Object.prototype
```

**Quá trình lookup chi tiết:**

```
user.toString()
  ↓
[Bước 1] user có toString? → KHÔNG
  ↓
[Bước 2] user.__proto__ (Object.prototype) có toString? → CÓ ✓
  ↓
[Kết quả] Chạy Object.prototype.toString
```

### 1.3 Prototype chain - Chuỗi tìm kiếm

```javascript
// Array
const arr = [1, 2, 3];

// Chuỗi prototype:
// arr
//   ├── [0]: 1, [1]: 2, [2]: 3
//   └── [[Prototype]] → Array.prototype
//                        ├── map()
//                        ├── filter()
//                        ├── join()
//                        └── [[Prototype]] → Object.prototype
//                                             ├── toString()
//                                             └── [[Prototype]] → null

arr.map(x => x * 2);      // Từ Array.prototype
arr.toString();            // Từ Object.prototype
```

**Điểm quan trọng:** Method **không được copy** vào từng array. Tất cả array share cùng `map()`, `filter()` từ `Array.prototype`.

---

## Phần 2: Function và Constructor

### 2.1 Function là object đặc biệt

```javascript
function User() {}

// User không chỉ là function, mà còn là object
// nó có property đặc biệt: User.prototype

console.log(typeof User);           // "function"
console.log(typeof User.prototype); // "object"
```

### 2.2 Constructor pattern - Tạo object từ function

**Pattern cơ bản:**

```javascript
function User(name) {
    this.name = name;  // gán property cho object sắp tạo
}

// Thêm method vào prototype
User.prototype.hello = function() {
    console.log("Xin chào, " + this.name);
};

// Sử dụng
const user1 = new User("Ojou");
user1.hello();  // Output: "Xin chào, Ojou"
```

### 2.3 Keyword `new` làm gì?

Khi viết `new User("A")`, JS thực hiện:

```javascript
// Dòng này:
const u = new User("A");

// JS thực tế làm:
const obj = {};                    // [1] Tạo object trống
obj.__proto__ = User.prototype;    // [2] Link object tới User.prototype
User.call(obj, "A");               // [3] Gọi User với this = obj
return obj;                        // [4] Trả về obj
```

**Kết quả:**

```
u
├── name: "A"
└── [[Prototype]] → User.prototype
                     ├── hello()
                     └── [[Prototype]] → Object.prototype
```

---

## Phần 3: Prototype vs Closure - So sánh chi tiết

### 3.1 Cách 1: Prototype Pattern

```javascript
function User(name) {
    this.name = name;
}

User.prototype.hello = function() {
    console.log(this.name);
};

const user1 = new User("A");
const user2 = new User("B");
const user3 = new User("C");
```

**Memory layout:**

```
user1              user2              user3
├── name: "A"      ├── name: "B"      ├── name: "C"
└── [[Prototype]]  └── [[Prototype]]  └── [[Prototype]]
        ↓                  ↓                  ↓
        └──────────────────┴──────────────────┘
                    ↓
            User.prototype
            ├── hello() ← SHARED (một cái duy nhất)
            └── [[Prototype]]
```

**Ưu điểm:**
- ✅ Method được **share** → tiết kiệm memory
- ✅ Dynamic: Thêm method sau đó, tất cả instance nhận ngay
- ✅ Hiệu suất cao

**Nhược điểm:**
- ❌ `this` dễ mất context (sẽ giải thích bên dưới)

---

### 3.2 Cách 2: Closure Pattern

```javascript
function User(name) {
    // Method nằm trong constructor
    this.hello = function() {
        console.log(name);  // Capture 'name' từ scope ngoài
    };
}

const user1 = new User("A");
const user2 = new User("B");
const user3 = new User("C");
```

**Memory layout:**

```
user1                          user2                          user3
├── name: "A"                  ├── name: "B"                  ├── name: "C"
└── hello: function() {...}    └── hello: function() {...}    └── hello: function() {...}
        ↓                               ↓                               ↓
     [Hàm 1]                        [Hàm 2]                        [Hàm 3]
   (Riêng biệt)                (Riêng biệt)                   (Riêng biệt)
   
   Mỗi hàm capture "name" từ constructor scope của riêng nó
```

**Ưu điểm:**
- ✅ Không cần lo về `this`
- ✅ `name` được **private** - không ai truy cập trực tiếp được
- ✅ An toàn, đơn giản

**Nhược điểm:**
- ❌ Mỗi instance tạo **function mới** → tốn memory hơn
- ❌ Không thể thêm method động sau này

---

## Phần 4: Vấn đề `this` - Tại sao nó khó?

### 4.1 Bài toán: `this` mất context

```javascript
function User(name) {
    this.name = name;
}

User.prototype.hello = function() {
    console.log(this.name);
};

const user = new User("Ojou");

// Cách 1: Gọi từ object - chạy OK
user.hello();  // this = user → Output: "Ojou" ✅

// Cách 2: Tách function ra - lỗi
const hello = user.hello;  // Tách function khỏi object
hello();                   // this = undefined → Error ❌
```

**Tại sao xảy ra?**

Khi bạn gọi `user.hello()`:
- JS biết owner là `user`
- Nên set `this = user`

Khi bạn gọi `hello()` trực tiếp:
- JS không còn biết owner là ai
- Nên `this = undefined` (strict mode) hoặc global object

---

### 4.2 Closure không bị vấn đề này

```javascript
function User(name) {
    // name là biến lexical scope, KHÔNG phụ thuộc this
    this.hello = function() {
        console.log(name);  // Lấy từ closure, không phải this
    };
}

const user = new User("Ojou");

// Cách 1: Gọi từ object
user.hello();  // Output: "Ojou" ✅

// Cách 2: Tách function ra - VẪNCHẠY OK
const hello = user.hello;
hello();       // Output: "Ojou" ✅ (không lỗi!)
```

**Lý do:** `name` được **capture** từ scope khi function tạo, không phụ thuộc `this`.

---

## Phần 5: Arrow Function và `this`

### 5.1 Arrow function không có `this` riêng

```javascript
class User {
    constructor(name) {
        this.name = name;
    }

    // Regular method - có this riêng
    regularHello() {
        console.log(this.name);
    }

    // Arrow method - capture this từ class scope
    arrowHello = () => {
        console.log(this.name);
    }
}

const user = new User("Ojou");

// Regular method - vấn đề this
const r = user.regularHello;
r();  // Error: this = undefined ❌

// Arrow method - không vấn đề
const a = user.arrowHello;
a();  // Output: "Ojou" ✅
```

### 5.2 Nhưng arrow method có chi phí

```javascript
// Arrow method:
class User {
    arrowHello = () => { ... }
}

// Thực tế giống như:
class User {
    constructor() {
        this.arrowHello = () => { ... }
    }
}

// Kết quả: Mỗi instance tạo function mới
// Tức là KHÔNG share method, tốn memory!
```

**So sánh:**

```
Regular method (prototype):
- user1.hello === user2.hello  // true (shared)
- Memory tốt, nhưng `this` khó

Arrow method (instance property):
- user1.arrowHello === user2.arrowHello  // false (riêng)
- `this` dễ, nhưng tốn memory
```

---

## Phần 6: Bản chất thật của JS OOP

### 6.1 Hai hệ tư tưởng trộn lẫn

**Hệ 1: Prototype System**
- Dựa trên **prototype chain** tìm kiếm
- Dùng **`this`** binding
- Method được **share**
- Gần với object-oriented

```javascript
function Animal(name) { this.name = name; }
Animal.prototype.speak = function() { ... }
```

---

**Hệ 2: Closure System**
- Dựa trên **lexical scope**
- Dùng **biến trong scope** thay vì `this`
- Private data bằng closure
- Gần với functional programming

```javascript
function Animal(name) {
    this.speak = function() { ... }  // Capture name
}
```

---

### 6.2 Modern JS là hỗn hợp của cả hai

```javascript
// Classes - trộn cả hai style
class User {
    constructor(name) {
        // Closure style - private method
        this.greet = () => console.log(name);
    }

    // Prototype style - shared method
    save() { ... }

    // Arrow - closure style lấy this
    validate = () => { ... }
}

// Hooks - functional style
const [count, setCount] = useState(0);

// Event handlers - closure capture
button.addEventListener('click', () => {
    console.log(someVariable);  // Closure
});
```

---

## Phần 7: Bảng so sánh tổng hợp

| Tiêu chí | Prototype | Closure | Arrow Method |
|---------|-----------|---------|--------------|
| **Memory** | ✅ Tốt | ❌ Kém | ❌ Kém |
| **`this` context** | ❌ Khó | ✅ Không cần | ✅ Dễ |
| **Dynamic methods** | ✅ Có thể thêm sau | ❌ Không | ❌ Không |
| **Privacy** | ❌ Không | ✅ Có (closure) | ✅ Có (closure) |
| **Performance** | ✅ Nhanh | ❌ Chậm hơn | ❌ Chậm hơn |
| **Học? Dễ không** | ❌ Khó | ✅ Dễ hơn | ✅ Dễ |

---

## Phần 8: Kết luận

**Lý do JS khó:**

```
"Tại sao lúc object-oriented, lúc functional?"
"Tại sao lúc this, lúc scope?"
"Tại sao class, lúc prototype, lúc closure?"
```

**Đáp án:** Vì JS thực sự **là cả hai** từ khi bắt đầu.

- **Brendan Eich** viết JavaScript trong **10 ngày**
- Trộn lẫn **Prototype** từ Self
- Trộn lẫn **First-class functions** từ Scheme
- Thêm **Syntax giống Java** để hấp dẫn

**Kết quả:** Một ngôn ngữ **vô cùng flexible** nhưng **khó hiểu** nếu không biết điểm chính.

**Cách học tốt:**
1. Hiểu **prototype chain** (object model)
2. Hiểu **closure** (function scope)
3. Hiểu **`this` binding** (context)
4. Rồi mới đến **class**, **async**, **modules**

---

## Phần 9: Ví dụ thực tế so sánh

### Tình huống: Tạo class User với method

```javascript
// ===== PROTOTYPE APPROACH =====
function User(name, email) {
    this.name = name;
    this.email = email;
}

User.prototype.save = function() {
    return fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify({ name: this.name, email: this.email })
    });
};

User.prototype.validate = function() {
    return this.email.includes('@');
};

// Sử dụng:
const user1 = new User("Ojou", "ojou@example.com");
user1.save();      // method share, memory tốt
user1.validate();  // nhưng this dễ mất context
```

```javascript
// ===== CLOSURE APPROACH =====
function User(name, email) {
    // Private data
    const data = { name, email };

    // Methods capture data từ closure
    this.save = function() {
        return fetch('/api/users', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    };

    this.validate = function() {
        return data.email.includes('@');
    };

    // Không ai truy cập trực tiếp được data
    this.getData = function() {
        return { ...data };  // Return copy
    };
}

// Sử dụng:
const user1 = new User("Ojou", "ojou@example.com");
user1.save();      // Mỗi method riêng biệt, tốn memory
user1.validate();  // Nhưng data private, an toàn
user1.data;        // undefined - không truy cập được
```

```javascript
// ===== MODERN CLASS (HỖN HỢP) =====
class User {
    #data = {};  // Private field

    constructor(name, email) {
        this.#data = { name, email };
    }

    save() {  // Prototype method - shared, nhưng trong class context
        return fetch('/api/users', {
            method: 'POST',
            body: JSON.stringify(this.#data)
        });
    }

    validate() {
        return this.#data.email.includes('@');
    }

    // Arrow method - có this an toàn
    getData = () => {
        return { ...this.#data };
    };
}

// Sử dụng: Giống prototype nhưng có private field
const user1 = new User("Ojou", "ojou@example.com");
user1.#data;  // Error - thực sự private
```

---

## Tóm tắt nhanh

**3 concepts nền tảng:**

1. **Prototype chain**: Cách JS tìm property thông qua `[[Prototype]]`
2. **Closure**: Cách function capture biến từ scope
3. **`this` binding**: Cách `this` được gán dựa vào cách gọi function

**Khi nào dùng cái nào:**

- **Prototype**: Cần performance, nhiều instances
- **Closure**: Cần private data, đơn giản, ít instances
- **Modern class**: Dự án lớn, team, cần rõ ràng

**Học hành tốt:** Hiểu bản chất trước, syntax sau.
