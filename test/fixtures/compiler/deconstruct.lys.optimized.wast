(module
 (type $0 (func))
 (type $1 (func (result i32)))
 (type $2 (func (param i64) (result i32)))
 (memory $0 1)
 (global $global$0 (mut i32) (i32.const 0))
 (global $global$1 (mut i32) (i32.const 0))
 (global $global$2 (mut i32) (i32.const 0))
 (global $global$3 (mut i32) (i32.const 0))
 (global $global$4 (mut i32) (i32.const 0))
 (global $global$5 (mut i32) (i32.const 0))
 (global $global$6 (mut i32) (i32.const 0))
 (export "memory" (memory $0))
 (export "test_getMaxMemory" (func $0))
 (export "isRed" (func $1))
 (start $2)
 (func $0 (; 0 ;) (type $1) (result i32)
  (global.get $global$6)
 )
 (func $1 (; 1 ;) (type $2) (param $0 i64) (result i32)
  (block $label$1 (result i32)
   (if
    (i64.ne
     (i64.and
      (local.get $0)
      (i64.const -4294967296)
     )
     (i64.const 8589934592)
    )
    (block
     (drop
      (br_if $label$1
       (i32.const 0)
       (i64.ne
        (i64.and
         (local.get $0)
         (i64.const -4294967296)
        )
        (i64.const 21474836480)
       )
      )
     )
     (br $label$1
      (i32.eq
       (i32.load
        (i32.wrap_i64
         (local.get $0)
        )
       )
       (i32.const 16711680)
      )
     )
    )
   )
   (i32.const 1)
  )
 )
 (func $2 (; 2 ;) (type $0)
  (global.set $global$0
   (i32.const 3)
  )
  (global.set $global$1
   (i32.shl
    (i32.const 1)
    (global.get $global$0)
   )
  )
  (global.set $global$2
   (i32.sub
    (global.get $global$1)
    (i32.const 1)
   )
  )
  (global.set $global$3
   (i32.const 1073741824)
  )
  (global.set $global$4
   (i32.const 65536)
  )
  (global.set $global$5
   (i32.and
    (i32.add
     (global.get $global$4)
     (global.get $global$2)
    )
    (i32.xor
     (global.get $global$2)
     (i32.const -1)
    )
   )
  )
  (global.set $global$6
   (global.get $global$5)
  )
 )
)
