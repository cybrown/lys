(module
 (type $0 (func (param i32)))
 (memory $0 1)
 (export "memory" (memory $0))
 (export "test" (func $0))
 (func $0 (; 0 ;) (type $0) (param $0 i32)
  (if
   (i32.ne
    (local.get $0)
    (i32.const 1)
   )
   (unreachable)
  )
 )
)
