<template>
	<el-menu
			:default-active="this.$store.state.menus.editableTabsValue"
			class="el-menu-vertical"
			background-color="#545c64"
			text-color="#fff"
			active-text-color="#ffd04b">

		<router-link to="/index">
			<el-menu-item index="Index"  @click="selectMenu({name: 'Index', title: '菜单'})">
				<template slot="title">
					<i class="el-icon-s-home"></i>
					<span slot="title">菜单设置</span>
				</template>
			</el-menu-item>
		</router-link>


		<el-submenu :index="menu.name" v-for="menu in menuList">
			<template slot="title">
				<i :class="menu.icon"></i>
				<span>{{menu.title}}</span>
			</template>

			<router-link :to="item.path" v-for="item in menu.children">
				<el-menu-item :index="item.name" @click="selectMenu(item)">
					<template slot="title">
						<i :class="item.icon"></i>
						<span slot="title">{{item.title}}</span>
					</template>
				</el-menu-item>
			</router-link>

		</el-submenu>

	</el-menu>
</template>

<script>
	export default {
		name: "SideMenu",
		data() {
			return {

			}
		},
		computed:  {
			menuList: {
				get() {
					return this.$store.state.menus.menuList
				}
			}
		},
		methods: {
			selectMenu(item) {
				this.$store.commit("addTab", item)
			}
		}
	}
</script>

<style scoped>
	.el-menu-vertical {
		height: 100%;
	}
</style>