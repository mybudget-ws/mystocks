<template>
  <footer class='page-footer blue-grey lighten-4'>
    <div class='container'>
      <div class='row'>
        <div class='col'>
          <a
            href='//2.mybudget.ws/#/agreement'
            class='blue-grey-text text-darken-1'
            target='_blank'
          >
            Пользовательское соглашение
          </a>
        </div>
        <div class='col'>
          <a
            href='2.mybudget.ws/#/privacy'
            class='blue-grey-text text-darken-1'
            target='_blank'
          >
            Политика конфиденциальности
          </a>
        </div>
        <div class='col right'>
          <a href='https://github.com/mybudget-ws/mystocks' target='_blank' class='blue-grey-text text-darken-1 github'>
            Исходный код
          </a>
        </div>
      </div>
    </div>
    <div class='footer-copyright'>
      <div class='container blue-grey-text text-darken-1'>
        <a
          href='//kalinichev.net'
          target='_blank'
          class='blue-grey-text text-darken-1'
        >
          © 2020 Alexander Kalinichev
        </a>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer'
};
</script>

<style scoped lang='sass'>
.page-footer
  margin-top: 260px

  .footer-copyright
    .container
      padding-left: 0.75rem

  .github
    margin-left: 10px
</style>
