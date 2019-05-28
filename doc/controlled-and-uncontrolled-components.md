# useRef 以及受控组件和非受控组件

## useRef

> useRef 返回一个可变的 ref 对象，其 .current 属性被初始化为传入的参数（initialValue）。返回的 ref 对象在组件的整个生命周期内保持不变。

```javascript
function CustomTextInput() {
    const inputEl = useRef(null);

    return (
        <div>
            <input
                type="text"
                ref={ inputEl } />

            <input
                type="button"
                value="Focus the text input"
                onClick={ focusTextInput } />
        </div>
    )

    function focusTextInput() {
        inputEl.current.focus();
    }
}
```

因为 `useRef()` 可以用于保存任何可变值, 所以我们可以像下面这样来使用 useRef 来保存一个定时器(纯函数?

```javascript
function Timer() {
    const [count, setCount] = useState(0);
    const intervalRef = useRef();

    useEffect(() => {
        const id = setInterval(() => {
            setCount(c => c + 1);
        }, 1000);

        intervalRef.current = id;
        return () => clearInterval(intervalRef.current);
    }, []);

    return (
        <>
            <h1>{count}</h1>
            <button onClick={() => clearInterval(intervalRef.current)}>Stop</button>
        </>
    );
}
```

也可以通过 ref 手动实现来获取上一轮的 props

```javascript
function Timer() {
    const [count, setCount] = useState(0);
    const intervalRef = useRef();
    const prevCountRef = useRef();

    useEffect(() => {
        const id = setInterval(() => {
            setCount(c => c + 1);
        }, 1000);

        intervalRef.current = id;
        return () => clearInterval(intervalRef.current);
    }, []);

    useEffect(() => {
        prevCountRef.current = count;
    }, [ count ]);

    return (
        <>
            <h1>now: { count }</h1>
            <h1>prev: { prevCountRef.current }</h1>
            <button onClick={() => clearInterval(intervalRef.current)}>Stop</button>
        </>
    );
}
```

## 非受控组件

非受控组件的 inputs 就像是传统的 HTML 表单的 inputs, 例如:

```javascript
function Form() {
    const inputEl = useRef(null);

    return (
        <div>
            <input type="text" ref={ inputEl } defaultValue="test" />
            <button onClick={ handleSubmitClick }>Sign up</button>
        </div>
    )

    function handleSubmitClick() {
        console.log(inputEl.current.value)
    }
}
```

>非受控组件将真实数据储存在 DOM 节点中，所以再使用非受控组件时，有时候反而更容易同时集成 React 和非 React 代码。如果你不介意代码美观性，并且希望快速编写代码，使用非受控组件往往可以减少你的代码量。

就是说只有在需要某个值的时候才去取, 虽然非受控组件功能不够强大, 但是某些简单的情况下简单实用

> 在 React 中，`<input type="file" />` 始终是一个非受控组件，因为它的值只能由用户设置，而不能通过代码控制。

```javascript
function Form() {
    const inputEl = useRef(null);

    return (
        <div>
            <label>
                <input type="file" ref={ inputEl } />
            </label>
            <button onClick={ handleSubmitClick }>Sign up</button>
        </div>
    )

    function handleSubmitClick() {
        console.log(inputEl.current.files[0])
    }
}

```

## 受控组件

> 在 HTML 中，表单元素（如`<input>`、 `<textarea>` 和 `<select>`）之类的表单元素通常自己维护 state，并根据用户输入进行更新

```javascript
function Form() {
    const [name, setName] = useState('test');

    return (
        <div>
            <input type="text" value={ name } onChange={ (e) => setName(e.target.value) } />
            <button onClick={ handleSubmitClick }>Sign up</button>
        </div>
    )

    function handleSubmitClick() {
        console.log(name)
    }
}
```

每输入一个字符串, `onChange` 将被触发然后调用 `setName`, 更新一个新的值到 state 里面, 所以就不需要在需要这个值的时候专门去 dom 里面获取

> 所以数据 (状态) 和 UI(输入) 总是同步的。状态为输入提供值，而输入要求表单更改当前值。

因此, 在下面这些情况的时候可以使用受控组件

* 立即反馈, 比如验证
* 根据表单字段的验证情况禁用和启用提交按钮
* 强制输入进行格式化, 比如强制大写输入

Element|Value property|Change callback|New value in the callback
--|:--:|--:|--:
`<input type="text"/>`|value="string"|onChange|event.target.value
`<input type="checkbox"/>`|checked={boolean}|onChange|event.target.checked
`<input type="radio"/>`|checked={boolean}|onChange|event.target.checked
`<textarea/>`|onChange|event.target.value|event.target.value
`<select/>`|value="option value"|onChange|event.target.value

> 有时使用受控组件会很麻烦，因为你需要为数据变化的每种方式都编写事件处理函数，并通过一个 React 组件传递所有的输入 state。当你将之前的代码库转换为 React 或将 React 应用程序与非 React 库集成时，这可能会令人厌烦。在这些情况下，你可能希望使用非受控组件, 这是实现输入表单的另一种方式。

## 参考文献

[React 中文文档](https://zh-hans.reactjs.org/)
[controlled-vs-uncontrolled-inputs-react](https://goshakkk.name/controlled-vs-uncontrolled-inputs-react/)
